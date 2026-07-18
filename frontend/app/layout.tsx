import type { Metadata } from "next";
import { Providers } from "./providers";
import "./globals.css";

export const metadata: Metadata = {
  title: "Route 53 Clone",
  description: "AWS Route53 management console clone",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-[#f5f5f5]">
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}