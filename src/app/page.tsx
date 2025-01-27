// Import the Link component from Next.js for client-side navigation
import Link from "next/link";

// This is the main page component for the home route ('/')
// In Next.js 13+, pages in the app directory are server components by default
export default function Home() {
  return (
    // Main container with CSS Grid layout
    // grid-rows-[20px_1fr_20px] creates 3 rows: 20px header, flexible middle, 20px footer
    // min-h-screen ensures the container takes at least the full viewport height
    <div className="grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)]">
      {/* Main content section */}
      {/* row-start-2 places this in the middle row of the grid */}
      {/* sm:items-start aligns items to start on small screens and up */}
      <main className="flex flex-col gap-8 row-start-2 items-center sm:items-start">
        <h1>My Blog</h1>
        <p>Coming soon...</p>
        {/* Next.js Link component for client-side navigation */}
        {/* This will navigate to /blog without a full page reload */}
        <Link href="/blog">Blog</Link>
      </main>

      {/* Footer section */}
      {/* row-start-3 places this in the bottom row of the grid */}
      <footer className="row-start-3 flex gap-6 flex-wrap items-center justify-center">
        <p>© 2025 My Blog</p>
      </footer>
    </div>
  );
}
