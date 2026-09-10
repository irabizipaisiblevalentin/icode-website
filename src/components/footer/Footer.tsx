import { Link } from "react-router-dom";

const FOOTER_LINKS = [
  { label: "Product", to: "/#product", external: false },
  { label: "Installation", to: "/installation", external: false },
  { label: "Documentation", to: "/documentation", external: false },
  { label: "Activate", to: "/access", external: false },
  { label: "Pricing", to: "/pricing", external: false },
  { label: "Contact", to: "/contact", external: false },
  { label: "Admin", to: "/admin/login", external: false },
] as const;

export function Footer() {
  return (
    <footer className="relative z-10 border-t border-edge">
      <div className="shell flex flex-col gap-10 py-14 md:flex-row md:items-start md:justify-between">
        <div className="max-w-xs">
          <Link to="/" className="flex items-center gap-2.5" aria-label="ICODE home">
            <img
              src="/logo-white.png"
              alt="ICODE"
              width={200}
              height={50}
              className="h-8 w-auto sm:h-9"
            />
          </Link>
          <p className="mt-4 text-sm leading-relaxed text-faint">
            A modern AI coding agent that brings intelligent software development
            directly to your terminal.
          </p>
        </div>

        <nav aria-label="Footer" className="flex flex-col gap-5">
          <span className="text-xs font-semibold uppercase tracking-[0.18em] text-faint">
            Explore
          </span>
          <div className="grid grid-cols-2 gap-x-10 gap-y-3 sm:grid-cols-3">
            {FOOTER_LINKS.map((link) =>
              link.to.startsWith("/#") ? (
                <Link
                  key={link.label}
                  to="/"
                  state={{ scrollTo: link.to.slice(2) }}
                  className="text-sm text-dim transition-colors hover:text-accent-400"
                >
                  {link.label}
                </Link>
              ) : (
                <Link
                  key={link.label}
                  to={link.to}
                  className="text-sm text-dim transition-colors hover:text-accent-400"
                >
                  {link.label}
                </Link>
              ),
            )}
          </div>
        </nav>
      </div>

      <div className="border-t border-edge/60">
        <div className="shell flex flex-col items-center justify-between gap-3 py-6 sm:flex-row">
          <p className="text-xs text-faint">
            © 2026 ICODE · Created by Irabizi Paisible Valentin
          </p>
          <p className="flex items-center gap-2 font-mono text-[11px] text-faint">
            <span className="inline-block size-1.5 rounded-full bg-accent-500/70" aria-hidden />
            ICODE is English-only
          </p>
        </div>
      </div>
    </footer>
  );
}