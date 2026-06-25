import type { Metadata } from "next";
import type { ReactNode } from "react";

import { appMeta } from "@/lib/app-meta";

import "./globals.css";

export const metadata: Metadata = {
  title: {
    default: appMeta.name,
    template: `%s · ${appMeta.shortName}`,
  },
  description: appMeta.description,
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="zh-CN">
      <body>{children}</body>
    </html>
  );
}

