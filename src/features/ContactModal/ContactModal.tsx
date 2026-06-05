"use client";

import { Link } from "@/src/i18n/navigation";
import { Button } from "@/src/shared";
import { useLocale, useTranslations } from "next-intl";
import { FormEvent, useEffect, useRef, useState } from "react";
import classes from "./ContactModal.module.scss";

interface ContactModalProps {
  isOpen: boolean;
  onClose: () => void;
  submitBtnLabel?: string;
}

const SUCCESS_TIMEOUT_MS = 2500;

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

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    title: "",
    message: "",
    agreedToPrivacy: false,
  });

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    if (isOpen) {
      triggerElementRef.current = document.activeElement as HTMLElement;
      document.body.style.overflow = "hidden";
      firstInputRef.current?.focus();

      const handleEscape = (e: KeyboardEvent) => {
        if (e.key === "Escape") onClose();
      };
      const handleTabKey = (e: KeyboardEvent) => {
        if (e.key !== "Tab" || !modalRef.current) return;

        const focusableElements = modalRef.current.querySelectorAll(
          'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])',
        );
        const firstElement = focusableElements[0] as HTMLElement;
        const lastElement = focusableElements[
          focusableElements.length - 1
        ] as HTMLElement;

        if (e.shiftKey) {
          if (document.activeElement === firstElement) {
            lastElement.focus();
            e.preventDefault();
          }
        } else {
          if (document.activeElement === lastElement) {
            firstElement.focus();
            e.preventDefault();
          }
        }
      };

      document.addEventListener("keydown", handleEscape);
      document.addEventListener("keydown", handleTabKey);

      return () => {
        // Очистка при закрытии или размонтировании
        document.body.style.overflow = "";
        document.removeEventListener("keydown", handleEscape);
        document.removeEventListener("keydown", handleTabKey);

        if (triggerElementRef.current) {
          triggerElementRef.current.focus();
        }
      };
    }
  }, [isOpen, onClose]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, type } = e.target;

    const value =
      e.target instanceof HTMLInputElement && type === "checkbox"
        ? e.target.checked
        : e.target.value;

    setFormData((prev) => ({ ...prev, [name]: value }));
    if (error) setError(null);
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);

    if (!formData.agreedToPrivacy) {
      setError(t("privacyError"));
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
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to send email");
      }

      setSuccess(true);
      setFormData({
        name: "",
        email: "",
        title: "",
        message: "",
        agreedToPrivacy: false,
      });

      setTimeout(() => {
        onClose();
        setSuccess(false);
      }, SUCCESS_TIMEOUT_MS);
    } catch (err) {
      setError(err instanceof Error ? err.message : t("errorMessage"));
    } finally {
      setIsLoading(false);
    }
  };

  if (!isOpen) return null;

  const hasError = !!error;

  return (
    <>
      <div className={classes.overlay} onClick={onClose} aria-hidden="true" />
      <div
        className={classes.modal}
        ref={modalRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby="modal-title"
        aria-describedby={hasError ? "form-error-message" : undefined}
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
            <div className={classes.formGroup}>
              <label htmlFor="name">{t("nameLabel")}</label>
              <input
                ref={firstInputRef}
                id="name"
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
                placeholder={t("namePlaceholder")}
                disabled={isLoading}
                aria-invalid={hasError}
              />
            </div>
            <div className={classes.formGroup}>
              <label htmlFor="email">{t("emailLabel")}</label>
              <input
                id="email"
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
                placeholder={t("emailPlaceholder")}
                disabled={isLoading}
                aria-invalid={hasError}
              />
            </div>
          </div>

          <div className={classes.formGroup}>
            <label htmlFor="title">{t("titleLabel")}</label>
            <input
              id="title"
              type="text"
              name="title"
              value={formData.title}
              onChange={handleChange}
              required
              placeholder={t("titlePlaceholder")}
              disabled={isLoading}
            />
          </div>

          <div className={classes.formGroup}>
            <label htmlFor="message">{t("messageLabel")}</label>
            <textarea
              id="message"
              name="message"
              value={formData.message}
              onChange={handleChange}
              required
              placeholder={t("messagePlaceholder")}
              rows={5}
              disabled={isLoading}
            />
          </div>

          <div className={classes.checkboxGroup}>
            <input
              type="checkbox"
              id="privacy"
              name="agreedToPrivacy"
              checked={formData.agreedToPrivacy}
              onChange={handleChange}
              required
              disabled={isLoading}
              aria-describedby="privacy-desc"
            />
            <label htmlFor="privacy" id="privacy-desc">
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
            </label>
          </div>

          {hasError && (
            <div className={classes.error} role="alert" id="form-error-message">
              {error}
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
