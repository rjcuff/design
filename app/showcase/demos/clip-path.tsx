"use client";

import styles from "./clip-path.module.css";
import { usePointerFill } from "./use-pointer-fill";

const LABEL = "clip path";

export default function ClipPath() {
  const ref = usePointerFill<HTMLDivElement>();

  return (
    <div ref={ref} className={styles.stack}>
      <div className={`${styles.layer} ${styles.orange}`}>
        <span className={`${styles.text} ${styles.light}`} aria-hidden="true">
          {LABEL}
        </span>
      </div>
      <div className={`${styles.layer} ${styles.panel}`}>
        <span className={`${styles.text} ${styles.dark}`}>{LABEL}</span>
      </div>
    </div>
  );
}
