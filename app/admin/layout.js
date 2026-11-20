import Link from "next/link";
import { redirect } from "next/navigation";
import { getAuthenticatedUser } from "../../lib/auth/session.js";
import { SYSTEM_MANAGER_ROLE_NAME } from "../../lib/auth/roles.js";
import LogoutButton from "../dashboard/logout-button.js";
import styles from "./admin.module.css";

export const dynamic = "force-dynamic";

const navigation = [
  { label: "Dashboard", href: "/admin", icon: "⌂", active: true },
  { label: "Users", icon: "♙" },
  { label: "Buildings", icon: "▦" },
  { label: "Rooms", icon: "▣" },
  { label: "Room Requests", icon: "▤" },
  { label: "Issues", icon: "⚑" },
  { label: "Settings", icon: "⚙" },
];

export default async function AdminLayout({ children }) {
  const user = await getAuthenticatedUser();

  if (!user) redirect("/");

  if (!user.roles.includes(SYSTEM_MANAGER_ROLE_NAME)) {
    redirect("/dashboard");
  }

  return (
    <div className={styles.adminLayout}>
      <aside className={styles.sidebar}>
        <div className={styles.brand}>
          <div className={styles.brandIcon}>L</div>
          <div>
            <h2>CampusFlow</h2>
            <p>ADMINISTRATION</p>
          </div>
        </div>

        <div className={styles.navSection}>
          <p className={styles.navHeading}>MAIN MENU</p>

          <nav className={styles.navigation}>
            {navigation.map((item) =>
              item.href ? (
                <Link
                  key={item.label}
                  href={item.href}
                  className={`${styles.navLink} ${
                    item.active ? styles.activeLink : ""
                  }`}
                >
                  <span className={styles.navIcon}>{item.icon}</span>
                  {item.label}
                </Link>
              ) : (
                <span
                  key={item.label}
                  className={`${styles.navLink} ${styles.disabledLink}`}
                  title="Coming soon"
                >
                  <span className={styles.navIcon}>{item.icon}</span>
                  {item.label}
                  <span className={styles.comingSoon}>Soon</span>
                </span>
              )
            )}
          </nav>
        </div>

        <div className={styles.sidebarFooter}>
          <p>LNBTI Campus Resource Hub</p>
          <span>Administration Portal</span>
        </div>
      </aside>

      <div className={styles.mainArea}>
        <header className={styles.topbar}>
          <div>
            <p className={styles.topbarLabel}>SYSTEM MANAGER</p>
            <p className={styles.welcomeText}>Welcome, {user.fullName}</p>
          </div>

          <div className={styles.accountArea}>
            <div className={styles.avatar}>
              {user.fullName.charAt(0).toUpperCase()}
            </div>
            <div className={styles.accountDetails}>
              <strong>{user.fullName}</strong>
              <span>System Manager</span>
            </div>
            <LogoutButton />
          </div>
        </header>

        <main className={styles.content}>{children}</main>
      </div>
    </div>
  );
}