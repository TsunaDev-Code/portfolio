"use client";

import { ContactModal } from "@/src/features";
import { Button } from "@/src/shared";
import { useState } from "react";

interface ContactButtonProps {
  label: string;
}

export function ContactButton({ label }: ContactButtonProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <>
      <Button onClick={() => setIsModalOpen(true)}>{label}</Button>
      <ContactModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        submitBtnLabel={label}
      />
    </>
  );
}
