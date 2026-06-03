"use client";
import cn from "clsx";
import { ReactNode } from "react";
import classes from "./Button.module.scss";

interface ButtonProps {
  children: ReactNode;
  type?: "button" | "reset" | "submit";
  disabled?: boolean;
  view?: "primary" | "secondary";
  onClick?: () => void;
}

export const Button = ({
  children,
  type,
  view = "primary",
  disabled,
  onClick,
}: ButtonProps) => {
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={cn(classes.button, {
        [classes.secondary]: view === "secondary",
      })}
    >
      {children}
    </button>
  );
};
