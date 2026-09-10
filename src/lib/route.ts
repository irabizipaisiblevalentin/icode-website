import { useEffect } from "react";
import { useLocation } from "react-router-dom";

export function useDocumentTitle(title: string) {
  useEffect(() => {
    const previous = document.title;
    document.title = title;
    return () => {
      document.title = previous;
    };
  }, [title]);
}

export function ScrollManager() {
  const location = useLocation();
  const { pathname, hash } = location;
  const state = location.state as { scrollTo?: string } | null;

  useEffect(() => {
    const id = state?.scrollTo ?? hash.replace("#", "");
    if (id) {
      const el = document.getElementById(id);
      if (el) {
        el.scrollIntoView({ behavior: "smooth", block: "start" });
        return;
      }
    }
    window.scrollTo({ top: 0, behavior: "auto" });
  }, [pathname, hash, state]);

  return null;
}