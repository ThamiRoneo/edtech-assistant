import Link from "next/link";

const SOCIAL = [
  {
    href: "https://x.com",
    label: "X",
    icon: XIcon,
  },
  {
    href: "https://facebook.com",
    label: "Facebook",
    icon: FacebookIcon,
  },
  {
    href: "https://instagram.com",
    label: "Instagram",
    icon: InstagramIcon,
  },
  {
    href: "https://tiktok.com",
    label: "TikTok",
    icon: TikTokIcon,
  },
];

export default function Footer() {
  return (
    <footer className="border-t border-border/60 mt-16">
      <div className="max-w-6xl mx-auto px-6 py-10">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="md:col-span-2">
            <Link href="/" className="flex items-center gap-2.5">
              <Mark />
              <span className="text-lg font-bold tracking-tight">EdTech</span>
              <span className="text-lg font-semibold text-primary">Assistant</span>
            </Link>
            <p className="mt-3 text-sm text-muted max-w-sm">
              AI-powered math tutoring for K-12 students. Curriculum-aligned mastery tracking, rubric-grounded grading, and Socratic tutoring.
            </p>
            <div className="mt-4 flex items-center gap-2">
              {SOCIAL.map((s) => {
                const Icon = s.icon;
                return (
                  <a
                    key={s.label}
                    href={s.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={s.label}
                    className="inline-flex h-8 w-8 items-center justify-center rounded-lg border border-border text-muted hover:text-foreground hover:border-primary/40 transition-colors"
                  >
                    <Icon />
                  </a>
                );
              })}
            </div>
          </div>
          <div>
            <h4 className="text-sm font-semibold mb-3">Product</h4>
            <ul className="space-y-2 text-sm text-muted">
              <li><Link href="/dashboard" className="hover:text-foreground">Dashboard</Link></li>
              <li><Link href="/submit" className="hover:text-foreground">Submit work</Link></li>
              <li><Link href="/mastery" className="hover:text-foreground">Mastery</Link></li>
              <li><Link href="/assess" className="hover:text-foreground">Practice</Link></li>
              <li><Link href="/tutor" className="hover:text-foreground">Tutor</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="text-sm font-semibold mb-3">Account</h4>
            <ul className="space-y-2 text-sm text-muted">
              <li><Link href="/sign-in" className="hover:text-foreground">Sign in</Link></li>
              <li><Link href="/sign-up" className="hover:text-foreground">Create account</Link></li>
            </ul>
          </div>
        </div>
        <div className="mt-8 pt-6 border-t border-border/60 flex flex-col sm:flex-row items-center justify-between gap-2">
          <p className="text-xs text-muted">© {new Date().getFullYear()} EdTech Assistant. All rights reserved.</p>
          <p className="text-xs text-muted">Built for K-12 learners.</p>
        </div>
      </div>
    </footer>
  );
}

function Mark() {
  return (
    <svg width="28" height="28" viewBox="0 0 28 28" fill="none" aria-hidden="true">
      <rect x="3" y="3" width="22" height="22" rx="7" fill="#7C3AED" />
      <path d="M9 18l4-10 5 10" stroke="#fff" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" />
      <circle cx="14" cy="13.5" r="1.4" fill="#7C3AED" />
    </svg>
  );
}

function XIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
    </svg>
  );
}

function FacebookIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.891h-2.33v6.988C18.343 21.128 22 16.991 22 12z" />
    </svg>
  );
}

function InstagramIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M7 2h10a5 5 0 015 5v10a5 5 0 01-5 5H7a5 5 0 01-5-5V7a5 5 0 015-5zm0 2a3 3 0 00-3 3v10a3 3 0 003 3h10a3 3 0 003-3V7a3 3 0 00-3-3H7zm5 3a5 5 0 110 10 5 5 0 010-10zm0 2a3 3 0 100 6 3 3 0 000-6zm4.75-2.75a1.25 1.25 0 110 2.5 1.25 1.25 0 010-2.5z" />
    </svg>
  );
}

function TikTokIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M19.59 6.69a4.83 4.83 0 01-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 01-5.2 1.74 2.89 2.89 0 012.31-4.64 2.93 2.93 0 01.88.13V9.4a6.84 6.84 0 00-1-.05A6.33 6.33 0 005 20.1a6.34 6.34 0 0010.86-4.43v-7a8.16 8.16 0 004.77 1.52v-3.4a4.85 4.85 0 01-1-.1z" />
    </svg>
  );
}
