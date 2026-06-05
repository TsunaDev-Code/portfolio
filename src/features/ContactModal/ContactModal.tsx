"use client";

import { Link } from "@/src/i18n/navigation";
import { Button, Checkbox, FormField } from "@/src/shared";
import { useLocale, useTranslations } from "next-intl";
import { FormEvent, useEffect, useRef, useState } from "react";
import classes from "./ContactModal.module.scss";

interface ContactModalProps {
  isOpen: boolean;
  onClose: () => void;
  submitBtnLabel?: string;
}

interface FormData {
  name: string;
  email: string;
  title: string;
  message: string;
  agreedToPrivacy: boolean;
}

type FieldErrors = Partial<Record<keyof FormData, string>>;

const SUCCESS_TIMEOUT_MS = 2500;
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/; // Исправлено экранирование точки
const FOCUSABLE_SELECTOR =
  'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])';

const INITIAL_FORM_DATA: FormData = {
  name: "",
  email: "",
  title: "",
  message: "",
  agreedToPrivacy: false,
};

export const ContactModal = ({
  isOpen,
  onClose,
  submitBtnLabel,
}: ContactModalProps) => {
  const t = useTranslations("ContactModal");
  const locale = useLocale();

  const modalRef = useRef<HTMLDivElement>(null);
  const firstInputRef = useRef<HTMLInputElement>(null);
  const triggerElementRef = useRef<HTMLElement | null>(null);
  const isLoadingRef = useRef(false);

  const [formData, setFormData] = useState<FormData>(INITIAL_FORM_DATA);
  const [fieldErrors, setFieldErrors] = useState<FieldErrors>({});
  const [serverError, setServerError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    isLoadingRef.current = isLoading;
  }, [isLoading]);

  useEffect(() => {
    if (!isOpen) return;

    const originalOverflow = document.body.style.overflow;
    triggerElementRef.current = document.activeElement as HTMLElement;
    document.body.style.overflow = "hidden";
    firstInputRef.current?.focus();

    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape" && !isLoadingRef.current) {
        onClose();
      }
    };

    const handleTabKey = (e: KeyboardEvent) => {
      if (e.key !== "Tab" || !modalRef.current) return;

      const focusableElements =
        modalRef.current.querySelectorAll(FOCUSABLE_SELECTOR);
      const firstElement = focusableElements[0] as HTMLElement;
      const lastElement = focusableElements[
        focusableElements.length - 1
      ] as HTMLElement;

      if (!firstElement || !lastElement) return;

      if (e.shiftKey) {
        if (document.activeElement === firstElement) {
          lastElement.focus();
          e.preventDefault();
        }
      } else if (document.activeElement === lastElement) {
        firstElement.focus();
        e.preventDefault();
      }
    };

    document.addEventListener("keydown", handleEscape);
    document.addEventListener("keydown", handleTabKey);

    return () => {
      document.body.style.overflow = originalOverflow;
      document.removeEventListener("keydown", handleEscape);
      document.removeEventListener("keydown", handleTabKey);

      if (triggerElementRef.current) {
        triggerElementRef.current.focus();
      }

      setFieldErrors({});
      setServerError(null);
      setSuccess(false);
      setIsLoading(false);
      setFormData(INITIAL_FORM_DATA);
    };
  }, [isOpen, onClose]);

  const validateForm = (): boolean => {
    const errors: FieldErrors = {};

    if (!formData.name.trim()) errors.name = t("validation.nameRequired");
    if (!EMAIL_REGEX.test(formData.email))
      errors.email = t("validation.invalidEmail");
    if (!formData.title.trim()) errors.title = t("validation.titleRequired");
    if (!formData.message.trim())
      errors.message = t("validation.messageRequired");
    if (!formData.agreedToPrivacy) errors.agreedToPrivacy = t("privacyError");

    setFieldErrors(errors);

    if (Object.keys(errors).length > 0) {
      const firstErrorField = Object.keys(errors)[0] as keyof FormData;
      const element = document.getElementById(firstErrorField);
      element?.focus();
    }

    return Object.keys(errors).length === 0;
  };

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLInputElement
    >,
  ) => {
    const { name, type } = e.target;
    const value =
      e.target instanceof HTMLInputElement && type === "checkbox"
        ? e.target.checked
        : e.target.value;

    setFormData((prev) => ({ ...prev, [name]: value }));

    if (fieldErrors[name as keyof FormData]) {
      setFieldErrors((prev) => ({ ...prev, [name]: undefined }));
    }

    if (serverError) setServerError(null);
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setFieldErrors({});
    setServerError(null);

    if (!validateForm()) {
      return;
    }

    setIsLoading(true);
    try {
      const response = await fetch("/api/send-email", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...formData, locale }),
      });

      if (!response.ok) {
        let errorMessage = t("errorMessage");
        const contentType = response.headers.get("content-type");

        if (contentType?.includes("application/json")) {
          try {
            const errorData = await response.json();
            errorMessage = errorData.message || errorMessage;
          } catch {}
        }
        throw new Error(errorMessage);
      }

      setSuccess(true);
      setFormData(INITIAL_FORM_DATA);

      setTimeout(() => {
        onClose();
        setSuccess(false);
      }, SUCCESS_TIMEOUT_MS);
    } catch (err) {
      setServerError(err instanceof Error ? err.message : t("errorMessage"));
    } finally {
      setIsLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <>
      <div
        className={classes.overlay}
        onClick={isLoading ? undefined : onClose}
        aria-hidden="true"
      />
      <div
        className={classes.modal}
        ref={modalRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby="modal-title"
      >
        <div className={classes.header}>
          <h2 id="modal-title">{t("title")}</h2>
          <button
            className={classes.closeBtn}
            onClick={onClose}
            aria-label={t("cancelBtn")}
            type="button"
            disabled={isLoading}
          >
            ✕
          </button>
        </div>

        <form onSubmit={handleSubmit} className={classes.form} noValidate>
          <div className={classes.fieldsGroup}>
            <FormField
              id="name"
              name="name"
              label={t("nameLabel")}
              type="text"
              value={formData.name}
              onChange={handleChange}
              placeholder={t("namePlaceholder")}
              disabled={isLoading}
              required
              error={fieldErrors.name}
              inputRef={firstInputRef}
            />
            <FormField
              id="email"
              name="email"
              label={t("emailLabel")}
              type="email"
              value={formData.email}
              onChange={handleChange}
              placeholder={t("emailPlaceholder")}
              disabled={isLoading}
              required
              error={fieldErrors.email}
            />
          </div>
          <FormField
            id="title"
            name="title"
            label={t("titleLabel")}
            type="text"
            value={formData.title}
            onChange={handleChange}
            placeholder={t("titlePlaceholder")}
            disabled={isLoading}
            required
            error={fieldErrors.title}
          />
          <FormField
            id="message"
            name="message"
            label={t("messageLabel")}
            type="textarea"
            value={formData.message}
            onChange={handleChange}
            placeholder={t("messagePlaceholder")}
            disabled={isLoading}
            required
            rows={5}
            error={fieldErrors.message}
          />
          <Checkbox
            id="privacy"
            name="agreedToPrivacy"
            checked={formData.agreedToPrivacy}
            onChange={handleChange}
            disabled={isLoading}
            required
            error={fieldErrors.agreedToPrivacy}
          >
            {t("privacyAgreement.part1")}
            <Link
              href="/privacy"
              target="_blank"
              rel="noopener noreferrer"
              className={classes.privacyLink}
            >
              {t("privacyAgreement.link")}
            </Link>
            {t("privacyAgreement.part2")}
          </Checkbox>

          {serverError && (
            <div className={classes.errorServer} role="alert">
              {serverError}
            </div>
          )}
          {success && (
            <div className={classes.success} role="status">
              {t("successMessage")}
            </div>
          )}

          <div className={classes.actions}>
            <Button view="secondary" disabled={isLoading} onClick={onClose}>
              {t("cancelBtn")}
            </Button>
            <Button type="submit" disabled={isLoading}>
              {isLoading ? t("sending") : submitBtnLabel || t("submitBtn")}
            </Button>
          </div>
        </form>
      </div>
    </>
  );
};
