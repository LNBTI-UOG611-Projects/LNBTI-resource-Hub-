import { redirect } from "next/navigation";
import { getAuthenticatedUser } from "../../lib/auth/session.js";
import LogoutButton from "./logout-button.js";
import styles from "./dashboard.module.css";

export const dynamic = "force-dynamic";

export default async function DashboardPage() {
  const user = await getAuthenticatedUser();
  if (!user) redirect("/");

  return (
    <main className={styles.dashboard}>
      <header className={styles.header}>
        <div>
          <p className={styles.eyebrow}>LNBTI CAMPUSFLOW</p>
          <h1>Campus dashboard</h1>
        </div>
        <LogoutButton />
      </header>
      <section className={styles.profile} aria-labelledby="profile-heading">
        <h2 id="profile-heading">Account</h2>
        <dl>
          <div><dt>Full name</dt><dd>{user.fullName}</dd></div>
          <div><dt>Email</dt><dd>{user.email}</dd></div>
          <div><dt>Assigned role{user.roles.length === 1 ? "" : "s"}</dt><dd>{user.roles.join(", ") || "No role assigned"}</dd></div>
        </dl>
      </section>
    </main>
  );
}