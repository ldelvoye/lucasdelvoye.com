import type { Metadata } from "next";
import type { ReactNode } from "react";
import { JetBrains_Mono } from "next/font/google";
import "@/styles/tokens.css";
import "./globals.css";
import "@/styles/chrome.css";

const mono = JetBrains_Mono({
  subsets: ["latin"],
  weight: ["400", "500", "700"],
  variable: "--font-mono",
  display: "swap",
});

const DESCRIPTION =
  "Software engineer in San Francisco. The site is a terminal, and the terminal runs smorg.";

const NO_JS_STYLE = [
  "[data-atmosphere],[data-intro]{display:none}",
  "[data-window]{width:100vw;height:100dvh;border-radius:0;border-width:0;box-shadow:none}",
  "[data-chrome]{height:var(--bar-h-full);background:var(--paper)}",
  "[data-chrome-win]{opacity:0}",
  "[data-chrome-app]{opacity:1}",
  "[data-dash]{visibility:visible}",
  "[data-status]{height:var(--status-h)}",
  '[data-drawn="false"]{visibility:visible}',
  "[data-hints]{display:none}",
].join("");

export const metadata: Metadata = {
  title: "Lucas Delvoye",
  description: DESCRIPTION,
  openGraph: {
    title: "Lucas Delvoye",
    description: DESCRIPTION,
    url: "https://lucasdelvoye.com",
    siteName: "Lucas Delvoye",
    type: "website",
  },
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en" className={mono.variable}>
      <body>
        <noscript>
          <style>{NO_JS_STYLE}</style>
        </noscript>
        {children}
      </body>
    </html>
  );
}
