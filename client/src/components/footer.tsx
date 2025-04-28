export default function Footer() {
  return (
    <footer className="border-t mt-auto py-6 px-4 md:px-8">
      <div className="flex flex-col sm:flex-row justify-between items-center">
        <div className="mb-4 sm:mb-0">
          <p className="text-sm text-muted-foreground dark:text-slate-400">
            &copy; {new Date().getFullYear()} SolarFlow | All rights reserved
          </p>
        </div>
        <div>
          <nav className="flex space-x-4 text-sm text-muted-foreground dark:text-slate-400">
            <a href="#" className="hover:underline">Privacy Policy</a>
            <a href="#" className="hover:underline">Terms of Service</a>
            <a href="#" className="hover:underline">Contact</a>
          </nav>
        </div>
      </div>
    </footer>
  );
}