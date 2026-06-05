import cn from "clsx";
import React from "react";
import classes from "./FormField.module.scss";

interface FormFieldProps {
  id: string;
  name: string;
  label: string;
  type?: "text" | "email" | "textarea";
  value: string;
  onChange: (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => void;
  placeholder: string;
  disabled?: boolean;
  required?: boolean;
  rows?: number;
  error?: string;
  inputRef?: React.RefObject<HTMLInputElement | HTMLTextAreaElement | null>;
}

export const FormField = ({
  id,
  name,
  label,
  type = "text",
  value,
  onChange,
  placeholder,
  disabled = false,
  required = false,
  rows = 5,
  error,
  inputRef,
}: FormFieldProps) => {
  const hasError = !!error;

  return (
    <div className={classes.formGroup}>
      <label
        htmlFor={id}
        className={cn(classes.label, { [classes.labelError]: hasError })}
      >
        {label}
      </label>

      {type === "textarea" ? (
        <textarea
          ref={inputRef as React.RefObject<HTMLTextAreaElement>}
          id={id}
          name={name}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          disabled={disabled}
          required={required}
          rows={rows}
          aria-invalid={hasError}
          className={cn(classes.textarea, { [classes.inputError]: hasError })}
        />
      ) : (
        <input
          ref={inputRef as React.RefObject<HTMLInputElement>}
          id={id}
          type={type}
          name={name}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          disabled={disabled}
          required={required}
          aria-invalid={hasError}
          className={cn(classes.input, { [classes.inputError]: hasError })}
        />
      )}

      {hasError && (
        <span className={classes.errorMessage} role="alert">
          {error}
        </span>
      )}
    </div>
  );
};
