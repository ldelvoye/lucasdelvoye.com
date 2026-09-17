"use client";

import * as Sentry from "@sentry/nextjs";
import { useEffect } from "react";
import { JetBrains_Mono } from "next/font/google";
import "@/styles/tokens.css";
import "./globals.css";
import styles from "./global-error.module.css";

const mono = JetBrains_Mono({
  subsets: ["latin"],
  weight: ["400", "500", "700"],
  variable: "--font-mono",
  display: "swap",
});

type Props = { error: Error & { digest?: string }; retry: () => void };

export default function GlobalError({ error, retry }: Props) {
  useEffect(() => {
    Sentry.captureException(error);
  }, [error]);
  return (
    <html lang="en" className={mono.variable}>
      <body>
        <main className={styles.screen}>
          <p className={styles.prompt}>$ smorg</p>
          <p className={styles.line}>smorg: the terminal crashed, and this was reported.</p>
          <p className={styles.line}>
            <button type="button" className={styles.retry} onClick={retry}>
              retry
            </button>
          </p>
        </main>
      </body>
    </html>
  );
}
