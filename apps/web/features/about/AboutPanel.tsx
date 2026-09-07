import type { ReactElement } from "react";
import { PixelImage } from "@/components/pixels/PixelArt";
import { Box } from "@/components/ui/Box";
import { KeyValue } from "@/components/ui/KeyValue";
import { AboutLinks } from "./AboutLinks";
import { BIO, FACTS, HOST_NAME, HOST_USER, PORTRAIT_SIZE, PORTRAIT_SRC } from "./content";
import styles from "./About.module.css";

const TAB_ID = "about";

export function AboutPanel(): ReactElement {
  const paragraphs = BIO.map((text) => <p key={text}>{text}</p>);
  return (
    <div className={styles.grid}>
      <Box title="about" className={styles.aboutBox}>
        <div className={styles.neo}>
          <span className={styles.art}>
            <PixelImage
              src={PORTRAIT_SRC}
              size={PORTRAIT_SIZE}
              label="Portrait of Lucas Delvoye as terminal pixel art"
            />
          </span>
          <div className={styles.info}>
            <div className={styles.host}>
              {HOST_USER}
              <span className={styles.at}>@</span>
              {HOST_NAME}
            </div>
            <KeyValue entries={FACTS} wide className={styles.facts} />
          </div>
        </div>
      </Box>
      <Box title="bio" className={styles.bioBox}>
        <div className={styles.prose}>{paragraphs}</div>
      </Box>
      <AboutLinks tabId={TAB_ID} className={styles.linksBox} />
    </div>
  );
}
