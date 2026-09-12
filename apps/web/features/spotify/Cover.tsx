import Image from "next/image";
import type { ReactElement } from "react";
import styles from "./Spotify.module.css";

export function Cover({
  src,
  alt,
  className,
}: {
  src: string;
  alt: string;
  className: string;
}): ReactElement {
  const classes = `${styles.frame} ${className}`;
  if (src === "") {
    return <span className={classes} role="img" aria-label={alt} />;
  }
  return (
    <span className={classes}>
      <Image src={src} alt={alt} fill unoptimized className={styles.image} />
    </span>
  );
}
