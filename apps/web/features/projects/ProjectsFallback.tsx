import type { ReactElement } from "react";
import { Box } from "@/components/ui/Box";
import styles from "./Projects.module.css";

export function ProjectsFallback(): ReactElement {
  return (
    <div className={styles.grid}>
      <Box title="projects" className={styles.list}>
        <span className={styles.loading}>loading…</span>
      </Box>
      <Box title="detail" focused className={styles.detail}>
        <span className={styles.loading}>loading…</span>
      </Box>
    </div>
  );
}
