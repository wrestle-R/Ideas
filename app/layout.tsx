import "./globals.css";
import SessionWrapper from "./session-provider";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Ideas",
  icons: {
    icon: "/icon_no_bg.png",
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <SessionWrapper>
          {children}
        </SessionWrapper>
      </body>
    </html>
  );
}
