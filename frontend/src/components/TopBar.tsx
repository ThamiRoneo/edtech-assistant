"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { UserButton } from "@clerk/nextjs";

const NAV = [
  { href: "/dashboard", label: "Dashboard", icon: DashboardIcon },
  { href: "/submit", label: "Submit", icon: SubmitIcon },
  { href: "/mastery", label: "Mastery", icon: MasteryIcon },
  { href: "/assess", label: "Practice", icon: AssessIcon },
  { href: "/tutor", label: "Tutor", icon: TutorIcon },
];

export default function TopBar() {
  const pathname = usePathname();

  return (
    <header
      className="fixed top-0 right-0 z-30 flex items-center justify-between px-5"
      style={{ left: "var(--shell-rail-w)", height: "var(--shell-top-h)" }}
    >
      <div className="flex items-center gap-2 text-sm text-muted">
        <Link href="/dashboard" className="hover:text-foreground transition-colors">
          Home
        </Link>
        <ChevronIcon />
        <span className="text-foreground font-medium">
          {activeLabel(pathname)}
        </span>
      </div>
      <div className="flex items-center gap-3">
        <UserButton />
      </div>
    </header>
  );
}

function activeLabel(pathname: string): string {
  const found = NAV.find((n) => pathname === n.href || pathname.startsWith(n.href + "/"));
  return found ? found.label : "EdTech Assistant";
}

function ChevronIcon() {
  return (
    <svg width="12" height="12" viewBox="0 0 12 12" fill="none" aria-hidden="true">
      <path d="M3 4.5l3 3 3-3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function DashboardIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 18 18" fill="none" aria-hidden="true">
      <rect x="2" y="11" width="4" height="5" rx="1" stroke="currentColor" strokeWidth="1.5" />
      <rect x="7" y="6" width="4" height="10" rx="1" stroke="currentColor" strokeWidth="1.5" />
      <rect x="12" y="9" width="4" height="8" rx="1" stroke="currentColor" strokeWidth="1.5" />
    </svg>
  );
}
function SubmitIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 18 18" fill="none" aria-hidden="true">
      <path d="M9 2v9M5 8l4-4 4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M3 14h12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  );
}
function MasteryIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 18 18" fill="none" aria-hidden="true">
      <path d="M3 15V5l6-4 6 4v10" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" />
      <path d="M8 15v-5l2-2 2 2v5" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" />
    </svg>
  );
}
function AssessIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 18 18" fill="none" aria-hidden="true">
      <circle cx="9" cy="9" r="7" stroke="currentColor" strokeWidth="1.5" />
      <path d="M9 5v4l3 2" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  );
}
function TutorIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 18 18" fill="none" aria-hidden="true">
      <path d="M2 13V6a5 5 0 015-5h6a5 5 0 015 5v7" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" />
      <path d="M7 16h4l-4 2v-2" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" />
    </svg>
  );
}