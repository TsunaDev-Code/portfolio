"use client";
import { FormEvent, useState } from "react";
import { Link } from "@/src/i18n/navigation";
import classes from "./ContactModal.module.scss";
import { Button } from "@/src/shared";

interface ContactModalProps {
  isOpen: boolean;
  onClose: () => void;
  submitBtnLabel?: string;
}

export const ContactModal = ({
  isOpen,
  onClose,
  submitBtnLabel,
}: ContactModalProps) => {
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

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const target = e.target;
    const name = target.name;

    const value =
      target.type === "checkbox"
        ? (target as HTMLInputElement).checked
        : target.value;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    setError(null);
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);

    if (!formData.agreedToPrivacy) {
      setError("Необходимо дать согласие на обработку персональных данных");
      return;
    }

    setIsLoading(true);
    try {
      const response = await fetch("/api/send-email", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
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
      }, 2000);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "An error occurred while sending",
      );
    } finally {
      setIsLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <>
      <div className={classes.overlay} onClick={onClose} />
      <div className={classes.modal}>
        <div className={classes.header}>
          <h2>Contact Me</h2>
          <button
            className={classes.closeBtn}
            onClick={onClose}
            aria-label="Close modal"
          >
            ✕
          </button>
        </div>
        <form onSubmit={handleSubmit} className={classes.form}>
          <div className={classes.fieldsGroup}>
            <div className={classes.formGroup}>
              <label htmlFor="name">Name</label>
              <input
                id="name"
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
                placeholder="Your name"
                disabled={isLoading}
              />
            </div>
            <div className={classes.formGroup}>
              <label htmlFor="email">Email</label>
              <input
                id="email"
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
                placeholder="your@email.com"
                disabled={isLoading}
              />
            </div>
          </div>
          <div className={classes.formGroup}>
            <label htmlFor="title">Title</label>
            <input
              id="title"
              type="text"
              name="title"
              value={formData.title}
              onChange={handleChange}
              required
              placeholder="Message title"
              disabled={isLoading}
            />
          </div>

          <div className={classes.formGroup}>
            <label htmlFor="message">Message</label>
            <textarea
              id="message"
              name="message"
              value={formData.message}
              onChange={handleChange}
              required
              placeholder="Your message"
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
            />
            <label htmlFor="privacy">
              Я даю согласие на обработку{" "}
              <Link href="/privacy" target="_blank" rel="noopener noreferrer">
                персональных данных
              </Link>{" "}
              в соответствии с политикой конфиденциальности
            </label>
          </div>

          {error && <div className={classes.error}>{error}</div>}
          {success && (
            <div className={classes.success}>Message sent successfully!</div>
          )}

          <div className={classes.actions}>
            <Button view="secondary" disabled={isLoading} onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit" disabled={isLoading}>
              {isLoading ? "Sending..." : submitBtnLabel || "Send"}
            </Button>
          </div>
        </form>
      </div>
    </>
  );
};
