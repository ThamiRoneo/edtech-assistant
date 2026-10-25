'use client';

import { UserButton } from "@clerk/nextjs";
import Link from "next/link";

export default function Dashboard() {
  return (
    <div className="min-h-screen">
      <nav className="bg-white border-b border-[var(--color-border)] px-6 py-4">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <Link href="/" className="text-xl font-bold text-[var(--color-primary)]">EdTech Assistant</Link>
          <div className="flex items-center gap-4">
            <Link href="/submit" className="hover:text-[var(--color-primary)]">Submit</Link>
            <Link href="/mastery" className="hover:text-[var(--color-primary)]">Mastery</Link>
            <Link href="/assess" className="hover:text-[var(--color-primary)]">Practice</Link>
            <Link href="/tutor" className="hover:text-[var(--color-primary)]">Tutor</Link>
            <UserButton />
          </div>
        </div>
      </nav>
      <main className="max-w-6xl mx-auto px-6 py-8">
        <h1 className="text-3xl font-bold mb-6">Dashboard</h1>
        <div className="grid md:grid-cols-3 gap-6">
          <Link href="/submit" className="bg-white p-6 rounded-lg border border-[var(--color-border)] hover:shadow-md">
            <h2 className="font-semibold text-lg mb-2">Submit Work</h2>
            <p className="text-gray-600">Get graded feedback</p>
          </Link>
          <Link href="/mastery" className="bg-white p-6 rounded-lg border border-[var(--color-border)] hover:shadow-md">
            <h2 className="font-semibold text-lg mb-2">View Mastery</h2>
            <p className="text-gray-600">Track progress</p>
          </Link>
          <Link href="/assess" className="bg-white p-6 rounded-lg border border-[var(--color-border)] hover:shadow-md">
            <h2 className="font-semibold text-lg mb-2">Practice</h2>
            <p className="text-gray-600">Target weak areas</p>
          </Link>
        </div>
      </main>
    </div>
  );
}
