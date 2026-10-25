import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "EdTech Assistant",
  description: "AI-powered Math K-12 learning assistant",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased">{children}</body>
    </html>
  );
}
