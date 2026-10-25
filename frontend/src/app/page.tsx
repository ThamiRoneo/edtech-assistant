'use client';

import Link from "next/link";
import { SignInButton, SignUpButton, SignedIn, SignedOut } from "@clerk/nextjs";

export default function Home() {
  return (
    <div>
      <div className="text-center mb-12 py-16">
        <h1 className="text-5xl font-bold text-[var(--color-foreground)] mb-6">Master Math with AI-Powered Tutoring</h1>
        <p className="text-xl text-[var(--color-muted-foreground)] mb-8 max-w-2xl mx-auto">
          Get instant feedback on your work, personalized practice, and Socratic tutoring tailored to your learning needs.
        </p>
        <div className="flex gap-4 justify-center">
          <SignedOut>
            <SignUpButton mode="modal">
              <button className="bg-[var(--color-primary)] text-white px-8 py-3 rounded-lg text-lg font-semibold hover:opacity-90 transition-opacity focus:outline-none focus:ring-2 focus:ring-[var(--color-ring)] focus:ring-offset-2">
                Get Started Free
              </button>
            </SignUpButton>
            <SignInButton mode="modal">
              <button className="bg-white text-[var(--color-primary)] px-8 py-3 rounded-lg text-lg font-semibold border-2 border-[var(--color-primary)] hover:bg-[var(--color-muted)] transition-colors focus:outline-none focus:ring-2 focus:ring-[var(--color-ring)] focus:ring-offset-2">
                Sign In
              </button>
            </SignInButton>
          </SignedOut>
          <SignedIn>
            <Link href="/submit" className="bg-[var(--color-primary)] text-white px-8 py-3 rounded-lg text-lg font-semibold hover:opacity-90 transition-opacity focus:outline-none focus:ring-2 focus:ring-[var(--color-ring)] focus:ring-offset-2">
              Go to Dashboard
            </Link>
          </SignedIn>
        </div>
      </div>
      
      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-lg shadow-sm border border-[var(--color-border)] hover:shadow-md transition-shadow">
          <h2 className="text-xl font-semibold mb-2 text-[var(--color-primary)]">📝 Submit & Grade</h2>
          <p className="text-[var(--color-muted-foreground)]">Get instant feedback on your math solutions</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-sm border border-[var(--color-border)] hover:shadow-md transition-shadow">
          <h2 className="text-xl font-semibold mb-2 text-[var(--color-accent)]">📊 Track Mastery</h2>
          <p className="text-[var(--color-muted-foreground)]">Monitor your progress across math topics</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-sm border border-[var(--color-border)] hover:shadow-md transition-shadow">
          <h2 className="text-xl font-semibold mb-2 text-[var(--color-secondary)]">🎯 Adaptive Practice</h2>
          <p className="text-[var(--color-muted-foreground)]">Get personalized practice based on your gaps</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-sm border border-[var(--color-border)] hover:shadow-md transition-shadow">
          <h2 className="text-xl font-semibold mb-2 text-[var(--color-primary)]">🧠 AI Tutor</h2>
          <p className="text-[var(--color-muted-foreground)]">Socratic tutoring to guide your thinking</p>
        </div>
      </div>
    </div>
  );
}
