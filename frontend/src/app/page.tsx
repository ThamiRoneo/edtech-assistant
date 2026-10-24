'use client';

import Link from "next/link";

export default function Home() {
  return (
    <div>
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">EdTech Assistant</h1>
        <p className="text-xl text-gray-600">Math K-12 learning assistant for individual learners</p>
      </div>
      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Link href="/submit" className="bg-white p-6 rounded-lg shadow-sm border hover:shadow-md transition-shadow">
          <h2 className="text-xl font-semibold mb-2 text-blue-600">Submit Work</h2>
          <p className="text-gray-600">Get instant feedback on your math solutions</p>
        </Link>
        <Link href="/mastery" className="bg-white p-6 rounded-lg shadow-sm border hover:shadow-md transition-shadow">
          <h2 className="text-xl font-semibold mb-2 text-green-600">Mastery</h2>
          <p className="text-gray-600">Track your progress across topics</p>
        </Link>
        <Link href="/assess" className="bg-white p-6 rounded-lg shadow-sm border hover:shadow-md transition-shadow">
          <h2 className="text-xl font-semibold mb-2 text-purple-600">Practice</h2>
          <p className="text-gray-600">Get adaptive practice based on your gaps</p>
        </Link>
        <Link href="/tutor" className="bg-white p-6 rounded-lg shadow-sm border hover:shadow-md transition-shadow">
          <h2 className="text-xl font-semibold mb-2 text-orange-600">Tutor</h2>
          <p className="text-gray-600">Socratic tutoring to guide your thinking</p>
        </Link>
      </div>
    </div>
  );
}
