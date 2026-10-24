import type { Metadata } from "next";
import { ClerkProvider } from "@clerk/nextjs";
import "./globals.css";

export const metadata: Metadata = {
  title: "EdTech Assistant",
  description: "Math K-12 assistant for individual learners",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider>
      <html lang="en">
        <body className="antialiased bg-gray-50">
          <nav className="bg-white border-b px-6 py-4">
            <div className="max-w-6xl mx-auto flex items-center justify-between">
              <a href="/" className="text-xl font-bold text-blue-600">EdTech Assistant</a>
              <div className="flex gap-6">
                <a href="/submit" className="text-gray-700 hover:text-blue-600">Submit Work</a>
                <a href="/mastery" className="text-gray-700 hover:text-blue-600">Mastery</a>
                <a href="/assess" className="text-gray-700 hover:text-blue-600">Practice</a>
                <a href="/tutor" className="text-gray-700 hover:text-blue-600">Tutor</a>
              </div>
            </div>
          </nav>
          <main className="max-w-6xl mx-auto px-6 py-8">{children}</main>
        </body>
      </html>
    </ClerkProvider>
  );
}
