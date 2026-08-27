"use client";

import styles from "./list-view.module.css";

const ROWS = [
  { title: "notifications", description: "email, push and in-app alerts" },
  { title: "appearance", description: "theme, density and accent color" },
  { title: "billing", description: "plan, invoices and payment method" },
  { title: "members", description: "invite teammates and set their roles" },
];

export default function ListView() {
  return (
    <ul className={styles.list}>
      {ROWS.map((row) => (
        <li key={row.title} className={styles.item}>
          <p className={styles.title}>{row.title}</p>
          <p className={styles.description}>{row.description}</p>
        </li>
      ))}
    </ul>
  );
}
