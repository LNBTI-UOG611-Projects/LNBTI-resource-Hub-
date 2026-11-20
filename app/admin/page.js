import { prisma } from "../../lib/prisma.js";
import styles from "./admin.module.css";

export default async function AdminDashboardPage() {
  const [
    totalUsers,
    totalBuildings,
    totalRooms,
    pendingRequests,
    openIssues,
  ] = await Promise.all([
    prisma.user.count(),
    prisma.building.count(),
    prisma.room.count(),
    prisma.roomRequest.count({
      where: { status: "PENDING" },
    }),
    prisma.issue.count({
      where: { status: "OPEN" },
    }),
  ]);

  const statistics = [
    {
      label: "Total Users",
      value: totalUsers,
      description: "Registered campus users",
      icon: "♙",
    },
    {
      label: "Buildings",
      value: totalBuildings,
      description: "Campus buildings",
      icon: "▦",
    },
    {
      label: "Rooms",
      value: totalRooms,
      description: "Available campus spaces",
      icon: "▣",
    },
    {
      label: "Pending Requests",
      value: pendingRequests,
      description: "Awaiting review",
      icon: "▤",
    },
    {
      label: "Open Issues",
      value: openIssues,
      description: "Issues requiring attention",
      icon: "⚑",
    },
  ];

  return (
    <div className={styles.dashboard}>
      <div className={styles.pageHeading}>
        <div>
          <p className={styles.breadcrumb}>Administration / Overview</p>
          <h1>Dashboard Overview</h1>
          <p>Monitor and manage your campus resources from one place.</p>
        </div>
      </div>

      <section className={styles.statsGrid} aria-label="Campus statistics">
        {statistics.map((stat) => (
          <article className={styles.statCard} key={stat.label}>
            <div className={styles.statTop}>
              <span className={styles.statLabel}>{stat.label}</span>
              <span className={styles.statIcon}>{stat.icon}</span>
            </div>

            <strong className={styles.statValue}>
              {stat.value.toLocaleString()}
            </strong>

            <span className={styles.statDescription}>
              {stat.description}
            </span>
          </article>
        ))}
      </section>

      <section className={styles.overviewSection}>
        <div className={styles.sectionHeading}>
          <div>
            <h2>Campus overview</h2>
            <p>A quick summary of your campus resource system.</p>
          </div>
        </div>

        <div className={styles.overviewGrid}>
          <article className={styles.overviewCard}>
            <h3>Resource Management</h3>
            <p>
              Manage campus buildings, rooms and other shared resources.
            </p>
            <span>Management module</span>
          </article>

          <article className={styles.overviewCard}>
            <h3>Room Requests</h3>
            <p>
              Review room booking requests submitted by campus users.
            </p>
            <span>{pendingRequests} pending requests</span>
          </article>

          <article className={styles.overviewCard}>
            <h3>Issue Management</h3>
            <p>
              Monitor reported campus issues and track their resolution.
            </p>
            <span>{openIssues} open issues</span>
          </article>
        </div>
      </section>
    </div>
  );
}