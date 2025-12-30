"use client";

import Link from "next/link";

export default function Navbar() {
  return (
    <nav className="w-full bg-white border-b shadow-sm">
      <div className="max-w-6xl mx-auto px-4 py-3 flex justify-between items-center">
        <h1 className="text-xl font-bold text-green-600">GutSense</h1>

        <div className="space-x-6 text-gray-700 font-medium">
          <Link href="/" className="hover:text-green-600">
            Home
          </Link>
          <Link href="/about" className="hover:text-green-600">
            About
          </Link>
          <Link href="/contact" className="hover:text-green-600">
            Contact
          </Link>
        </div>
      </div>
    </nav>
  );
}
