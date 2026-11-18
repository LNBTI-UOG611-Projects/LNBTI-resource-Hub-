"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import styles from "./dashboard.module.css";

export default function LogoutButton() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const router = useRouter();

  async function handleLogout() {
    setIsSubmitting(true);
    try {
      await fetch("/api/auth/logout", { method: "POST" });
    } finally {
      router.replace("/");
      router.refresh();
      setIsSubmitting(false);
    }
  }

  return (
    <button className={styles.logoutButton} type="button" onClick={handleLogout} disabled={isSubmitting}>
      {isSubmitting ? "Signing out..." : "Sign out"}
    </button>
  );
}