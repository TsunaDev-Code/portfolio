import React from "react";
import classes from "./Checkbox.module.scss";

interface CheckboxProps {
  id: string;
  name: string;
  checked: boolean;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  disabled?: boolean;
  required?: boolean;
  error?: string;
  children: React.ReactNode;
}

export const Checkbox = ({
  id,
  name,
  checked,
  onChange,
  disabled = false,
  required = false,
  error,
  children,
}: CheckboxProps) => {
  const hasError = !!error;

  return (
    <div className={classes.checkboxGroup}>
      <input
        type="checkbox"
        id={id}
        name={name}
        checked={checked}
        onChange={onChange}
        required={required}
        disabled={disabled}
        aria-invalid={hasError}
      />
      <label htmlFor={id} className={hasError ? classes.labelError : ""}>
        {children}
      </label>
    </div>
  );
};
