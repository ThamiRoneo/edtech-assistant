import type { Metadata } from "next";
import { ClerkProvider, SignInButton, SignUpButton, SignedIn, SignedOut, UserButton } from "@clerk/nextjs";
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
    <ClerkProvider>
      <html lang="en">
        <head>
          <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;600;700;800&display=swap" rel="stylesheet" />
        </head>
        <body className="antialiased">
          <nav className="bg-white border-b border-[var(--color-border)] px-6 py-4">
            <div className="max-w-6xl mx-auto flex items-center justify-between">
              <a href="/" className="text-xl font-bold text-[var(--color-primary)]">EdTech Assistant</a>
              <div className="flex items-center gap-6">
                <a href="/submit" className="text-[var(--color-foreground)] hover:text-[var(--color-primary)] transition-colors">Submit Work</a>
                <a href="/mastery" className="text-[var(--color-foreground)] hover:text-[var(--color-primary)] transition-colors">Mastery</a>
                <a href="/assess" className="text-[var(--color-foreground)] hover:text-[var(--color-primary)] transition-colors">Practice</a>
                <a href="/tutor" className="text-[var(--color-foreground)] hover:text-[var(--color-primary)] transition-colors">Tutor</a>
                <div className="flex items-center gap-2 ml-4">
                  <SignedOut>
                    <SignInButton mode="modal">
                      <button className="text-[var(--color-foreground)] hover:text-[var(--color-primary)] px-3 py-2 transition-colors">Log In</button>
                    </SignInButton>
                    <SignUpButton mode="modal">
                      <button className="bg-[var(--color-primary)] text-white px-4 py-2 rounded-lg hover:opacity-90 transition-opacity">Sign Up</button>
                    </SignUpButton>
                  </SignedOut>
                  <SignedIn>
                    <UserButton />
                  </SignedIn>
                </div>
              </div>
            </div>
          </nav>
          <main className="max-w-6xl mx-auto px-6 py-8">{children}</main>
        </body>
      </html>
    </ClerkProvider>
  );
}
