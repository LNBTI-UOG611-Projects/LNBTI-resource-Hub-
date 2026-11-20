"use client";

import Link from "next/link";
import { useState } from "react";
import { PUBLIC_REGISTRATION_ROLES } from "../../lib/auth/roles.js";
import styles from "./register.module.css";

const phonePattern = /^\+?[\d\s().-]{7,30}$/;

function ShieldIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">
      <path d="M12 3.2 19 6v5.1c0 4.7-2.9 8-7 9.7-4.1-1.7-7-5-7-9.7V6l7-2.8Z" />
      <path d="m9 12.2 2 2 4-4.2" />
    </svg>
  );
}

function ArrowIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">
      <path d="M5 12h14M13 6l6 6-6 6" />
    </svg>
  );
}

function EyeIcon({ visible }) {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">
      {visible ? (
        <>
          <path d="m3 3 18 18M10.6 10.6a2 2 0 0 0 2.8 2.8" />
          <path d="M9.9 5.2A10.7 10.7 0 0 1 12 5c5.2 0 8.7 4.7 9.5 6-.3.5-1.3 1.9-2.8 3.2M6.2 6.2C3.9 7.7 2.7 9.7 2.5 11c.8 1.3 4.3 6 9.5 6 1 0 1.9-.2 2.7-.5" />
        </>
      ) : (
        <>
          <path d="M2.5 12S6 5 12 5s9.5 7 9.5 7-3.5 7-9.5 7-9.5-7-9.5-7Z" />
          <circle cx="12" cy="12" r="2.5" />
        </>
      )}
    </svg>
  );
}

export default function RegisterPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formError, setFormError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  async function handleSubmit(event) {
    event.preventDefault();
    const form = event.currentTarget;
    setIsSubmitting(true);
    setFormError("");
    setSuccessMessage("");

    try {
      const formData = new FormData(form);
      const phone = formData.get("phone");
      if (typeof phone !== "string" || !phonePattern.test(phone.trim())) {
        setFormError("Enter a valid phone number.");
        return;
      }

      const password = formData.get("password");
      const confirmPassword = formData.get("confirmPassword");
      if (password !== confirmPassword) {
        setFormError("Passwords do not match.");
        return;
      }

      const response = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          fullName: formData.get("fullName"),
          email: formData.get("email"),
          phone: phone.trim(),
          password,
          confirmPassword,
          role: formData.get("role"),
          termsAccepted: formData.get("terms") === "on",
        }),
      });
      const result = await response.json();
      if (!response.ok) throw new Error(result.error || "Registration failed.");
      setSuccessMessage(result.message || "Registration successful.");
      form.reset();
    } catch (error) {
      setFormError(error.message || "Registration is temporarily unavailable.");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <main className={`login-shell ${styles.registerPage}`}>
      <section className="brand-panel" aria-label="About LNBTI CampusFlow">
        <div className="brand-lines" aria-hidden="true" />
        <div className="brand-orbit brand-orbit-one" aria-hidden="true" />
        <div className="brand-orbit brand-orbit-two" aria-hidden="true" />
        <div className="coral-swell" aria-hidden="true" />

        <div className="brand-content">
          <div className="institution-lockup">
            <div className="logo-mark">LNBTI</div>
            <div className="institution-name">
              <span>LNBTI</span>
              <span>LANKA NIPPON BIZTECH INSTITUTE</span>
            </div>
          </div>

          <div className="brand-message">
            <div className="status-pill">
              <span className="status-dot" />
              Campus operations, connected
            </div>
            <h1>Join your campus. Simplify everything.</h1>
            <p>
              Create your CampusFlow account and access campus resources and
              services in one place.
            </p>
          </div>

          <div className="feature-list" aria-label="CampusFlow features">
            <article className="feature-card is-highlighted">
              <span className="feature-number">01</span>
              <span className="feature-copy">Issue tracking</span>
              <span className="feature-indicator" aria-hidden="true" />
            </article>
            <article className="feature-card">
              <span className="feature-number">02</span>
              <span className="feature-copy">Issue tracking</span>
              <span className="feature-indicator" aria-hidden="true" />
            </article>
            <article className="feature-card">
              <span className="feature-number">03</span>
              <span className="feature-copy">Issue tracking</span>
              <span className="feature-indicator" aria-hidden="true" />
            </article>
          </div>
        </div>

        <footer className="brand-footer">
          <span>LNBTI CampusFlow</span>
          <span>Resource Allocation System</span>
        </footer>
      </section>

      <section className="form-panel" aria-label="Create your account">
        <div className="form-wrap">
          <div className="form-heading">
            <span className="eyebrow">GET STARTED</span>
            <h2>Create your account</h2>
            <p>Enter your details to join CampusFlow.</p>
          </div>

          <form
            className={styles.registerForm}
            onSubmit={handleSubmit}
          >
            <div className="field-group">
              <label htmlFor="full-name">Full Name</label>
              <input
                id="full-name"
                name="fullName"
                type="text"
                placeholder="Enter your full name"
                autoComplete="name"
                maxLength={150}
                required
              />
            </div>

            <div className="field-group">
              <label htmlFor="email">Email Address</label>
              <input
                id="email"
                name="email"
                type="email"
                placeholder="name@lnbti.edu.lk"
                autoComplete="email"
                maxLength={255}
                required
              />
            </div>

            <div className="field-group">
              <label htmlFor="phone">Phone Number</label>
              <input
                id="phone"
                name="phone"
                type="tel"
                placeholder="Enter your phone number"
                autoComplete="tel"
                maxLength={30}
                required
              />
            </div>

            <div className="field-group">
              <label htmlFor="role">Register as</label>
              <select id="role" name="role" defaultValue="" required>
                <option value="" disabled>Select your role</option>
                {PUBLIC_REGISTRATION_ROLES.map((role) => (
                  <option key={role} value={role}>{role.replaceAll("_", " ")}</option>
                ))}
              </select>
            </div>

            <div className="field-group">
              <label htmlFor="password">Password</label>
              <div className="password-field">
                <input
                  id="password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="Create a password"
                  autoComplete="new-password"
                  minLength={10}
                  maxLength={72}
                  required
                />
                <button
                  className="visibility-toggle"
                  type="button"
                  onClick={() => setShowPassword((visible) => !visible)}
                  aria-label={showPassword ? "Hide password" : "Show password"}
                  aria-pressed={showPassword}
                >
                  <EyeIcon visible={showPassword} />
                </button>
              </div>
            </div>

            <div className="field-group">
              <label htmlFor="confirm-password">Confirm Password</label>
              <div className="password-field">
                <input
                  id="confirm-password"
                  name="confirmPassword"
                  type={showConfirmPassword ? "text" : "password"}
                  placeholder="Confirm your password"
                  autoComplete="new-password"
                  minLength={10}
                  maxLength={72}
                  required
                />
                <button
                  className="visibility-toggle"
                  type="button"
                  onClick={() => setShowConfirmPassword((visible) => !visible)}
                  aria-label={
                    showConfirmPassword
                      ? "Hide confirm password"
                      : "Show confirm password"
                  }
                  aria-pressed={showConfirmPassword}
                >
                  <EyeIcon visible={showConfirmPassword} />
                </button>
              </div>
            </div>

            <label className="remember-option" htmlFor="terms">
              <input id="terms" name="terms" type="checkbox" required />
              <span className="custom-check" aria-hidden="true" />
              <span>I agree to the Terms and Conditions</span>
            </label>

            {(formError || successMessage) && (
              <p className={formError ? styles.formError : styles.formSuccess} role={formError ? "alert" : "status"}>
                {formError || successMessage}
              </p>
            )}

            <button className="signin-button" type="submit" disabled={isSubmitting}>
              <span>{isSubmitting ? "Creating account..." : "Create Account"}</span>
              <ArrowIcon />
            </button>
          </form>

          <p className={styles.accountPrompt}>
            <Link href="/">Back to Login</Link>
          </p>

          <div className="access-divider">
            <span />
            <p>CAMPUS ACCESS</p>
            <span />
          </div>

          <aside className="support-card">
            <div className="support-icon">
              <ShieldIcon />
            </div>
            <div>
              <h3>Need help accessing your account?</h3>
              <p>Contact the LNBTI system support team for assistance.</p>
            </div>
            <a
              className="support-link"
              href="mailto:support@lnbti.edu.lk"
              aria-label="Email LNBTI system support"
            >
              <ArrowIcon />
            </a>
          </aside>
        </div>

        <footer className="form-footer">
          © 2026 LNBTI CampusFlow - Resource Allocation System
        </footer>
      </section>
    </main>
  );
}