import { Link } from "wouter";

export default function Footer() {
  return (
    <footer className="bg-background shadow-sm border-t px-6 py-4">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between">
        <div className="flex items-center space-x-1">
          <span className="text-sm text-gray-500 dark:text-slate-400">© {new Date().getFullYear()} AUITS</span>
          <span className="text-sm text-gray-500 dark:text-slate-400">-</span>
          <span className="text-sm text-gray-500 dark:text-slate-400">SolarFlow</span>
        </div>
        <div className="mt-2 md:mt-0 flex items-center space-x-4">
          <Link href="#" className="text-sm text-gray-500 hover:text-gray-700 dark:text-slate-400 dark:hover:text-slate-300">
            Terms
          </Link>
          <Link href="#" className="text-sm text-gray-500 hover:text-gray-700 dark:text-slate-400 dark:hover:text-slate-300">
            Privacy
          </Link>
          <Link href="#" className="text-sm text-gray-500 hover:text-gray-700 dark:text-slate-400 dark:hover:text-slate-300">
            Support
          </Link>
        </div>
      </div>
    </footer>
  );
}
