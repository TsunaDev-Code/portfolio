"use client";

import { FormEvent, useState } from "react";
import { Button } from "../Button";
import classes from "./ContactModal.module.scss";

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
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    setError(null);
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch("/api/send-email", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to send email");
      }

      setSuccess(true);
      setFormData({ name: "", email: "", title: "", message: "" });
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

          {error && <div className={classes.error}>{error}</div>}
          {success && (
            <div className={classes.success}>Message sent successfully!</div>
          )}

          <div className={classes.actions}>
            <Button view="secondary" disabled={isLoading} onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit" disabled={isLoading}>
              {isLoading ? "Sending..." : submitBtnLabel}
            </Button>
          </div>
        </form>
      </div>
    </>
  );
};
