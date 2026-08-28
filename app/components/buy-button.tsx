import { pack } from "@/app/skills";
import styles from "./buy-button.module.css";

/**
 * Renders as a link when a checkout url is configured and as a disabled
 * button when it is not, so the page never ships a buy button that goes
 * nowhere.
 */
export function BuyButton() {
  const label = (
    <>
      buy the pack
      <span className={styles.price}>{pack.price}</span>
    </>
  );

  if (!pack.checkoutUrl) {
    return (
      <button type="button" className={styles.button} disabled>
        {label}
      </button>
    );
  }

  return (
    <a
      href={pack.checkoutUrl}
      className={styles.button}
      // Leaves the site for Stripe. noreferrer is not needed for a payment
      // processor we are deliberately handing the referrer to, but noopener
      // is, since this opens in a new tab.
      target="_blank"
      rel="noopener"
    >
      {label}
    </a>
  );
}
