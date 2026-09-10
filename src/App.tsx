import { lazy, Suspense } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Route, Routes, useLocation } from "react-router-dom";
import { Nav } from "./components/navigation/Nav";
import { Footer } from "./components/footer/Footer";
import { Backdrop } from "./components/background/Backdrop";
import { CustomCursor } from "./components/ui/CustomCursor";
import { Loader } from "./components/animations/Loader";
import { ScrollManager } from "./lib/route";
import { usePrefersReducedMotion } from "./lib/hooks";
import { Home } from "./pages/Home";

const Installation = lazy(() =>
  import("./pages/Installation").then((m) => ({ default: m.Installation })),
);
const Documentation = lazy(() =>
  import("./pages/Documentation").then((m) => ({ default: m.Documentation })),
);
const Pricing = lazy(() =>
  import("./pages/Pricing").then((m) => ({ default: m.Pricing })),
);
const Contact = lazy(() =>
  import("./pages/Contact").then((m) => ({ default: m.Contact })),
);
const Access = lazy(() =>
  import("./pages/Access").then((m) => ({ default: m.Access })),
);
const Admin = lazy(() =>
  import("./pages/Admin").then((m) => ({ default: m.Admin })),
);
const AdminLogin = lazy(() =>
  import("./pages/AdminLogin").then((m) => ({ default: m.AdminLogin })),
);
const NotFound = lazy(() =>
  import("./pages/NotFound").then((m) => ({ default: m.NotFound })),
);

export default function App() {
  const location = useLocation();
  const reduced = usePrefersReducedMotion();

  return (
    <div className="relative min-h-screen">
      <ScrollManager />
      <Backdrop />
      <Loader />
      <Nav />
      <CustomCursor />

      <AnimatePresence mode="wait" initial={false}>
        <motion.main
          key={location.pathname}
          initial={reduced ? false : { opacity: 0, y: 12 }}
          animate={reduced ? undefined : { opacity: 1, y: 0 }}
          exit={reduced ? undefined : { opacity: 0, y: -8 }}
          transition={{ duration: 0.35, ease: "easeOut" }}
        >
          <Suspense fallback={<PageFallback />}>
            <Routes location={location}>
              <Route path="/" element={<Home />} />
              <Route path="/installation" element={<Installation />} />
              <Route path="/documentation" element={<Documentation />} />
              <Route path="/pricing" element={<Pricing />} />
              <Route path="/contact" element={<Contact />} />
              <Route path="/access" element={<Access />} />
              <Route path="/activate" element={<Access />} />
              <Route path="/admin" element={<Admin />} />
              <Route path="/admin/login" element={<AdminLogin />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </Suspense>
        </motion.main>
      </AnimatePresence>

      <Footer />
    </div>
  );
}

function PageFallback() {
  return (
    <div className="flex min-h-[50vh] items-center justify-center" aria-label="Loading">
      <span className="font-mono text-xs tracking-[0.3em] text-faint">
        LOADING
        <span className="ml-1 inline-block h-[1em] w-[0.55em] translate-y-[0.15em] bg-accent-400/70 animate-blink" />
      </span>
    </div>
  );
}