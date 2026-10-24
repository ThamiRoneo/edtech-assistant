import Link from "next/link";

export default function Home() {
  return (
    <main className="p-8">
      <h1 className="text-2xl font-bold">EdTech Assistant</h1>
      <nav className="mt-4 flex gap-4">
        <Link href="/submit">Submit Work</Link>
        <Link href="/mastery">Mastery</Link>
        <Link href="/assess">Practice</Link>
        <Link href="/tutor">Tutor</Link>
      </nav>
    </main>
  );
}
