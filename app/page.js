"use client";

import { useState } from "react";
import styles from "./login.module.css";

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

export default function SignInPage() {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <main className={`login-shell ${styles.loginPage}`}>
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
            <h1>Everything your campus needs, in one flow.</h1>
            <p>
              A smarter way to request rooms, manage resources and keep campus
              services moving.
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

      <section className="form-panel" aria-label="Sign in">
        <div className="form-wrap">
          <div className="form-heading">
            <span className="eyebrow">WELCOME BACK</span>
            <h2>Sign in to CampusFlow</h2>
            <p>Enter your account details to access your campus workspace.</p>
          </div>

          <form className="signin-form" onSubmit={(event) => event.preventDefault()}>
            <div className="field-group">
              <label htmlFor="email">Email address</label>
              <input
                id="email"
                name="email"
                type="email"
                placeholder="name@lnbti.edu.lk"
                autoComplete="email"
              />
            </div>

            <div className="field-group">
              <div className="label-row">
                <label htmlFor="password">Password</label>
                <a className="text-link forgot-link" href="mailto:support@lnbti.edu.lk?subject=Password%20assistance">
                  Forgot password?
                </a>
              </div>
              <div className="password-field">
                <input
                  id="password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="Enter your password"
                  autoComplete="current-password"
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

            <div className="form-options">
              <label className="remember-option" htmlFor="remember">
                <input id="remember" name="remember" type="checkbox" />
                <span className="custom-check" aria-hidden="true" />
                <span>Remember me</span>
              </label>
              <span className="secure-badge">
                <span className="secure-dot" />
                Secure access
              </span>
            </div>

            <button className="signin-button" type="submit">
              <span>Sign in</span>
              <ArrowIcon />
            </button>
          </form>

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