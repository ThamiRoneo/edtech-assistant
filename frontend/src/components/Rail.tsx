"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const NAV = [
  { href: "/dashboard", label: "Dashboard", icon: "home" },
  { href: "/submit", label: "Submit", icon: "submit" },
  { href: "/mastery", label: "Mastery", icon: "mastery" },
  { href: "/assess", label: "Practice", icon: "assess" },
  { href: "/tutor", label: "Tutor", icon: "tutor" },
];

export default function Rail() {
  const pathname = usePathname();

  return (
    <aside
      className="fixed top-0 left-0 z-30 flex flex-col"
      style={{ width: "var(--shell-rail-w)", height: "100vh" }}
    >
      <div className="px-5 pt-5 pb-4">
        <Link href="/" className="flex items-center gap-2.5">
          <Mark />
          <span className="text-lg font-bold tracking-tight text-foreground">
            EdTech
          </span>
          <span className="text-lg font-semibold text-primary">Assistant</span>
        </Link>
      </div>

      <nav className="flex-1 px-3 pb-4 space-y-1">
        {NAV.map((item) => {
          const active =
            pathname === item.href || pathname.startsWith(item.href + "/");
          return (
            <Link
              key={item.href}
              href={item.href}
              aria-current={active ? "page" : undefined}
              className={[
                "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors",
                active
                  ? "bg-primary text-white shadow-sm"
                  : "text-muted hover:text-foreground hover:bg-primary/5",
              ].join(" ")}
            >
              <NavIcon name={item.icon} active={active} />
              <span>{item.label}</span>
            </Link>
          );
        })}
      </nav>

      <div className="px-4 pb-5">
        <div className="rounded-xl bg-primary/5 p-3">
          <div className="text-xs font-semibold text-primary uppercase tracking-wide">
            Need help?
          </div>
          <p className="mt-1 text-xs text-muted leading-relaxed">
            Ask the tutor anything — it works through the problem with you.
          </p>
        </div>
      </div>
    </aside>
  );
}

function Mark() {
  return (
    <svg width="28" height="28" viewBox="0 0 28 28" fill="none" aria-hidden="true">
      <rect x="3" y="3" width="22" height="22" rx="7" fill="#7C3AED" />
      <path
        d="M9 18l4-10 5 10"
        stroke="#fff"
        strokeWidth="2.4"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <circle cx="14" cy="13.5" r="1.4" fill="#7C3AED" />
    </svg>
  );
}

function NavIcon({ name, active }: { name: string; active: boolean }) {
  const stroke = active ? "#FFFFFF" : "currentColor";
  const sw = 1.5;
  switch (name) {
    case "home":
      return (
        <svg width="18" height="18" viewBox="0 0 18 18" fill="none" aria-hidden="true">
          <path d="M3 10l6-6 6 6" stroke={stroke} strokeWidth={sw} strokeLinejoin="round" />
          <path d="M5 10v7h8v-7" stroke={stroke} strokeWidth={sw} strokeLinejoin="round" />
        </svg>
      );
    case "submit":
      return (
        <svg width="18" height="18" viewBox="0 0 18 18" fill="none" aria-hidden="true">
          <path d="M9 2v9M5 8l4-4 4 4" stroke={stroke} strokeWidth={sw} strokeLinecap="round" strokeLinejoin="round" />
          <path d="M3 14h12" stroke={stroke} strokeWidth={sw} strokeLinecap="round" />
        </svg>
      );
    case "mastery":
      return (
        <svg width="18" height="18" viewBox="0 0 18 18" fill="none" aria-hidden="true">
          <path d="M3 15V5l6-4 6 4v10" stroke={stroke} strokeWidth={sw} strokeLinejoin="round" />
          <path d="M8 15v-5l2-2 2 2v5" stroke={stroke} strokeWidth={sw} strokeLinejoin="round" />
        </svg>
      );
    case "assess":
      return (
        <svg width="18" height="18" viewBox="0 0 18 18" fill="none" aria-hidden="true">
          <circle cx="9" cy="9" r="7" stroke={stroke} strokeWidth={sw} />
          <path d="M9 5v4l3 2" stroke={stroke} strokeWidth={sw} strokeLinecap="round" />
        </svg>
      );
    case "tutor":
      return (
        <svg width="18" height="18" viewBox="0 0 18 18" fill="none" aria-hidden="true">
          <path d="M2 13V6a5 5 0 015-5h6a5 5 0 015 5v7" stroke={stroke} strokeWidth={sw} strokeLinejoin="round" />
          <path d="M7 16h4l-4 2v-2" stroke={stroke} strokeWidth={sw} strokeLinejoin="round" />
        </svg>
      );
    default:
      return null;
  }
}