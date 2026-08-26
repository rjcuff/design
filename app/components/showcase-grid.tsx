import { showcaseItems } from "@/app/showcase/items";
import { ShowcaseCard } from "./showcase-card";
import styles from "./showcase.module.css";

export function ShowcaseGrid() {
  return (
    <div className={styles.grid}>
      {showcaseItems.map((item) => (
        <ShowcaseCard key={item.id} {...item} />
      ))}
    </div>
  );
}
