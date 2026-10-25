import Link from "next/link";
import { SignInButton, SignUpButton, SignedIn, SignedOut } from "@clerk/nextjs";

export default function Home() {
  return (
    <main className="min-h-screen">
      <nav className="bg-white border-b border-[var(--color-border)] px-6 py-4">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <div className="text-xl font-bold text-[var(--color-primary)]">EdTech Assistant</div>
          <div className="flex items-center gap-3">
            <SignedOut>
              <SignInButton mode="modal"><button className="px-4 py-2 hover:text-[var(--color-primary)]">Log In</button></SignInButton>
              <SignUpButton mode="modal"><button className="bg-[var(--color-primary)] text-white px-4 py-2 rounded-lg hover:opacity-90">Sign Up</button></SignUpButton>
            </SignedOut>
            <SignedIn>
              <Link href="/dashboard" className="bg-[var(--color-primary)] text-white px-4 py-2 rounded-lg">Dashboard</Link>
            </SignedIn>
          </div>
        </div>
      </nav>
      <section className="max-w-6xl mx-auto px-6 py-20 text-center">
        <h1 className="text-5xl font-bold mb-6">Master Math with AI-Powered Tutoring</h1>
        <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">Get instant feedback, personalized practice, and Socratic tutoring for K-12 Math</p>
        <SignedOut>
          <SignUpButton mode="modal"><button className="bg-[var(--color-primary)] text-white px-8 py-3 rounded-lg text-lg">Get Started Free</button></SignUpButton>
        </SignedOut>
        <SignedIn>
          <Link href="/dashboard" className="bg-[var(--color-primary)] text-white px-8 py-3 rounded-lg text-lg">Go to Dashboard</Link>
        </SignedIn>
      </section>
    </main>
  );
}
