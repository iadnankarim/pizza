export function Footer() {
  return (
    <footer className="mt-auto bg-footer text-white/80">
      <div className="mx-auto flex max-w-7xl flex-col gap-2 px-4 py-6 text-sm sm:flex-row sm:items-center sm:justify-between sm:px-6">
        <p>All rights reserved © Pizza by Mern Space {new Date().getFullYear()}</p>
        <p>
          Created with <span className="text-yellow-400">♥</span> by Coder&apos;s Gyan
        </p>
      </div>
    </footer>
  );
}
