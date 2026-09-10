import { useEffect, useState } from "react";
import { Link, NavLink, useLocation } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import { LockKeyhole, Menu, X } from "lucide-react";
import { NAV_LINKS } from "../../lib/data";
import { useHasScrolled, usePrefersReducedMotion } from "../../lib/hooks";
import { cn } from "../../lib/cn";

export function Nav() {
  const scrolled = useHasScrolled(16);
  const [open, setOpen] = useState(false);
  const location = useLocation();
  const reduced = usePrefersReducedMotion();

  useEffect(() => {
    setOpen(false);
  }, [location.pathname, location.hash]);

  useEffect(() => {
    document.documentElement.style.overflow = open ? "hidden" : "";
    return () => {
      document.documentElement.style.overflow = "";
    };
  }, [open]);

  return (
    <>
      <motion.header
        initial={{ y: -60, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        className={cn(
          "fixed inset-x-0 top-0 z-50 transition-all duration-300",
          scrolled
            ? "border-b border-edge bg-base/80 backdrop-blur-xl"
            : "border-b border-transparent bg-transparent",
        )}
      >
        <nav
          aria-label="Primary"
          className={cn(
            "shell flex items-center justify-between transition-all duration-300",
            scrolled ? "h-14" : "h-[72px]",
          )}
        >
          <Link
            to="/"
            className="group flex items-center gap-2.5"
            aria-label="ICODE home"
          >
            <img
              src="/logo-white.png"
              alt="ICODE"
              width={200}
              height={50}
              className="h-8 w-auto opacity-90 transition-opacity group-hover:opacity-100 sm:h-9"
            />
          </Link>

          <div className="hidden items-center gap-1 lg:flex">
            {NAV_LINKS.map((link) => (
              <NavLink
                key={link.label}
                to={link.to}
                className={({ isActive }) =>
                  cn(
                    "rounded-lg px-3.5 py-2 text-[13.5px] font-medium transition-colors",
                    isActive ? "text-fg" : "text-dim hover:text-fg",
                  )
                }
              >
                {link.label}
              </NavLink>
            ))}
          </div>

          <div className="flex items-center gap-2">
            <Link
              to="/admin"
              className="hidden h-9 items-center gap-2 rounded-lg border border-edge px-4 text-sm font-medium text-dim transition-all hover:border-edge-strong hover:text-fg sm:inline-flex"
            >
              <LockKeyhole className="size-3.5" aria-hidden />
              Admin
            </Link>
            <Link
              to="/installation"
              className="hidden h-9 items-center gap-2 rounded-lg border border-edge-strong bg-white/[0.05] px-4 text-sm font-medium text-fg transition-all hover:border-accent-500/50 hover:bg-white/[0.08] sm:inline-flex"
            >
              Install ICODE
            </Link>
            <button
              type="button"
              onClick={() => setOpen((v) => !v)}
              aria-expanded={open}
              aria-label={open ? "Close menu" : "Open menu"}
              className="grid size-10 place-items-center rounded-lg border border-edge text-fg lg:hidden"
            >
              {open ? <X className="size-5" /> : <Menu className="size-5" />}
            </button>
          </div>
        </nav>
      </motion.header>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.22 }}
            className="fixed inset-0 z-40 bg-base/95 backdrop-blur-2xl lg:hidden"
          >
            <div className="shell flex h-full flex-col justify-center gap-1 pt-20">
              {NAV_LINKS.map((link, i) => (
                <motion.div
                  key={link.label}
                  initial={reduced ? false : { opacity: 0, x: -18 }}
                  animate={reduced ? undefined : { opacity: 1, x: 0 }}
                  transition={{ delay: 0.05 + i * 0.05, duration: 0.35 }}
                >
                  <NavLink
                    to={link.to}
                    className="block border-b border-edge/60 py-4 text-2xl font-semibold tracking-tight text-fg"
                  >
                    {link.label}
                  </NavLink>
                </motion.div>
              ))}
              <motion.div
                initial={reduced ? false : { opacity: 0, y: 14 }}
                animate={reduced ? undefined : { opacity: 1, y: 0 }}
                transition={{ delay: 0.35, duration: 0.35 }}
                className="mt-8 flex flex-col gap-3"
              >
                <Link
                  to="/installation"
                  className="inline-flex h-12 items-center justify-center gap-2 rounded-xl bg-accent-500 px-6 font-semibold text-black"
                >
                  Install ICODE
                </Link>
                <Link
                  to="/admin"
                  className="inline-flex h-12 items-center justify-center gap-2 rounded-xl border border-edge px-6 font-medium text-dim"
                >
                  <LockKeyhole className="size-4" aria-hidden />
                  Admin
                </Link>
              </motion.div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}