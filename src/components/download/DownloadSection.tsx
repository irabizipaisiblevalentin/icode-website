import { useEffect, useRef, useState, type KeyboardEvent, type ReactNode } from "react";
import { motion } from "framer-motion";
import {
  Download,
  ExternalLink,
  FileArchive,
  Package,
  CircleAlert,
} from "lucide-react";
import { SectionHeading } from "../ui/SectionHeading";
import { ICONS } from "../installation/OSSelector";
import { Reveal } from "../animations/Reveal";
import { usePrefersReducedMotion } from "../../lib/hooks";
import {
  type DownloadGroup,
  type LinuxKind,
  type PlatformId,
  RELEASES_URL,
  classifyAssets,
  fetchLatestRelease,
  formatBytes,
} from "../../lib/download";
import { cn } from "../../lib/cn";

const PLATFORMS: { id: PlatformId; label: string }[] = [
  { id: "windows", label: "Windows" },
  { id: "macos", label: "macOS" },
  { id: "linux", label: "Linux" },
];

const LINUX_KINDS: { kind: LinuxKind; label: string; hint: string }[] = [
  { kind: "deb", label: ".deb", hint: "Debian · Ubuntu" },
  { kind: "rpm", label: ".rpm", hint: "Fedora · RHEL" },
  { kind: "tar", label: "tar.gz", hint: "Portable archive" },
];

const KIND_ICONS: Record<LinuxKind, ReactNode> = {
  deb: <Package className="size-4" aria-hidden />,
  rpm: <Package className="size-4" aria-hidden />,
  tar: <FileArchive className="size-4" aria-hidden />,
};

interface DownloadButtonProps {
  href: string;
  label: string;
  size?: string;
  primary?: boolean;
  icon?: ReactNode;
}

function DownloadButton({ href, label, size, primary, icon }: DownloadButtonProps) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className={cn(
        "inline-flex h-11 items-center justify-center gap-2 rounded-xl px-5 text-sm font-semibold transition-colors",
        primary
          ? "bg-accent-500 text-black hover:bg-accent-400"
          : "border border-edge-strong bg-white/[0.04] text-fg hover:border-accent-500/50 hover:bg-white/[0.08]",
      )}
    >
      {icon ?? <Download className="size-4" aria-hidden />}
      {label}
      {size ? <span className={cn("font-mono text-xs", primary ? "text-black/60" : "text-faint")}>{size}</span> : null}
    </a>
  );
}

function PlatformCard({ asset, note }: { asset: { name: string; size: number; browser_download_url: string }; note?: string }) {
  return (
    <div className="glass flex flex-col gap-4 rounded-2xl p-5 sm:flex-row sm:items-center sm:justify-between sm:p-6">
      <div className="min-w-0">
        <p className="truncate font-mono text-[13px] text-fg">{asset.name}</p>
        {note ? <p className="mt-1 text-sm text-faint">{note}</p> : null}
      </div>
      <div className="shrink-0">
        <DownloadButton href={asset.browser_download_url} label="Download" size={formatBytes(asset.size)} primary />
      </div>
    </div>
  );
}

export function DownloadSection({ className }: { className?: string }) {
  const reduced = usePrefersReducedMotion();
  const [platform, setPlatform] = useState<PlatformId>("windows");
  const [group, setGroup] = useState<DownloadGroup | null>(null);
  const [version, setVersion] = useState<string>("");
  const [releaseUrl, setReleaseUrl] = useState<string>(RELEASES_URL);
  const [failed, setFailed] = useState(false);
  const refs = useRef<Record<PlatformId, HTMLButtonElement | null>>(
    {} as Record<PlatformId, HTMLButtonElement | null>,
  );

  useEffect(() => {
    let alive = true;
    void fetchLatestRelease().then((release) => {
      if (!alive) return;
      if (!release || release.assets.length === 0) {
        setFailed(true);
        return;
      }
      setGroup(classifyAssets(release.assets));
      setVersion(release.tag_name);
      setReleaseUrl(release.html_url || RELEASES_URL);
    });
    return () => {
      alive = false;
    };
  }, []);

  const select = (id: PlatformId) => {
    setPlatform(id);
    refs.current[id]?.focus();
  };

  const onKeyDown = (event: KeyboardEvent, id: PlatformId) => {
    const order = PLATFORMS.map((p) => p.id);
    const index = order.indexOf(id);
    if (!["ArrowLeft", "ArrowRight", "Home", "End"].includes(event.key)) return;
    event.preventDefault();
    let next = index;
    if (event.key === "ArrowRight") next = (index + 1) % order.length;
    if (event.key === "ArrowLeft") next = (index - 1 + order.length) % order.length;
    if (event.key === "Home") next = 0;
    if (event.key === "End") next = order.length - 1;
    select(order[next]);
  };

  const linuxByArch = (arch: "x64" | "arm64") =>
    (group?.linux ?? []).filter((f) => f.arch === arch);

  return (
    <section id="download" className={cn("relative scroll-mt-24", className)}>
      <div className="shell">
        <SectionHeading
          eyebrow="Desktop app"
          title="Download the iCode editor"
          description={
            version
              ? `Ready-to-run installers for Windows, macOS, and Linux. Version ${version} — packaged right out of the box.`
              : "Ready-to-run installers for Windows, macOS, and Linux — packaged right out of the box."
          }
        />

        <Reveal variant="rise">
          <div className="glass rounded-3xl p-5 sm:p-7">
            <div
              role="tablist"
              aria-label="Operating system"
              className="inline-flex items-center gap-1 rounded-xl border border-edge bg-white/[0.03] p-1"
            >
              {PLATFORMS.map((p) => {
                const selected = platform === p.id;
                return (
                  <button
                    key={p.id}
                    ref={(el) => {
                      refs.current[p.id] = el;
                    }}
                    role="tab"
                    aria-selected={selected}
                    id={`dl-tab-${p.id}`}
                    aria-controls="dl-panel"
                    onClick={() => select(p.id)}
                    onKeyDown={(event) => onKeyDown(event, p.id)}
                    type="button"
                    className={cn(
                      "relative flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-medium transition-colors",
                      selected ? "text-fg" : "text-faint hover:text-dim",
                    )}
                  >
                    {selected && !reduced && (
                      <motion.span
                        layoutId="dl-os-active-pill"
                        transition={{ type: "spring", stiffness: 380, damping: 32 }}
                        className="absolute inset-0 rounded-lg bg-white/[0.08] ring-1 ring-white/10"
                        aria-hidden
                      />
                    )}
                    <span className="relative z-10 flex items-center gap-2">
                      {ICONS[p.id]}
                      {p.label}
                    </span>
                  </button>
                );
              })}
            </div>

            <div id="dl-panel" role="tabpanel" aria-labelledby={`dl-tab-${platform}`} className="mt-6">
              {group ? (
                <>
                  {platform === "windows" && group.windows ? (
                    <div className="flex flex-col gap-3">
                      <PlatformCard
                        asset={group.windows}
                        note="64-bit (x64) · Windows 10 and 11 · User or system installer"
                      />
                      <p className="max-w-2xl text-sm leading-relaxed text-faint">
                        Downloads are unsigned, so Windows may show SmartScreen. Click
                        <span className="mx-1 rounded border border-edge bg-white/[0.04] px-1.5 py-0.5 font-mono text-xs text-dim">More info</span>
                        then <span className="font-mono text-dim">Run anyway</span>.
                      </p>
                    </div>
                  ) : null}

                  {platform === "macos" && group.macos ? (
                    <div className="flex flex-col gap-3">
                      <PlatformCard
                        asset={group.macos}
                        note="Apple Silicon (arm64) · macOS 12 and later"
                      />
                      <p className="max-w-2xl text-sm leading-relaxed text-faint">
                        The app is not notarized. Right-click the app in Finder (or
                        open it via <span className="font-mono text-dim">Control-click</span>) and choose
                        <span className="ml-1 rounded border border-edge bg-white/[0.04] px-1.5 py-0.5 font-mono text-xs text-dim">Open</span>
                        to launch it the first time.
                      </p>
                    </div>
                  ) : null}

                  {platform === "linux" ? (
                    <div className="flex flex-col gap-5">
                      {(["x64", "arm64"] as const).map((arch) => {
                        const files = linuxByArch(arch);
                        if (files.length === 0) return null;
                        return (
                          <div key={arch}>
                            <p className="mb-2.5 flex items-center gap-2 font-mono text-xs uppercase tracking-[0.16em] text-faint">
                              {arch === "x64" ? "Intel / AMD 64-bit" : "ARM 64-bit"}
                              <span className="rounded-full border border-accent-500/30 bg-accent-500/10 px-2 py-0.5 font-mono text-[10px] normal-case tracking-wider text-accent-400">
                                {arch}
                              </span>
                            </p>
                            <div className="flex flex-col gap-3 sm:grid sm:grid-cols-3">
                              {LINUX_KINDS.map(({ kind, label, hint }) => {
                                const file = files.find((f) => f.kind === kind);
                                if (!file) return null;
                                return (
                                  <a
                                    key={kind}
                                    href={file.asset.browser_download_url}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="glass group flex flex-col gap-1 rounded-2xl p-4 transition-colors hover:border-accent-500/40"
                                  >
                                    <span className="flex items-center gap-2 font-mono text-[13px] text-fg">
                                      {KIND_ICONS[kind]}
                                      {label}
                                    </span>
                                    <span className="text-xs text-faint">{hint}</span>
                                    <span className="mt-2 font-mono text-xs text-accent-400">
                                      {formatBytes(file.asset.size)} · Download
                                    </span>
                                  </a>
                                );
                              })}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  ) : null}
                </>
              ) : failed ? (
                <div className="flex items-start gap-3 rounded-xl border border-edge bg-white/[0.02] p-4 text-sm leading-relaxed text-dim">
                  <CircleAlert className="mt-0.5 size-4 shrink-0 text-accent-400" aria-hidden />
                  <p>
                    We could not load the available installers right now.{" "}
                    <a
                      href={RELEASES_URL}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="font-medium text-accent-400 transition-colors hover:text-accent-300"
                    >
                      Browse all installers on GitHub
                    </a>
                    .
                  </p>
                </div>
              ) : (
                <div className="flex h-40 flex-col items-center justify-center gap-3">
                  <span className="size-5 animate-spin rounded-full border-2 border-accent-500/30 border-t-accent-400" aria-hidden />
                  <span className="font-mono text-xs tracking-[0.25em] text-faint">CHECKING RELEASES</span>
                </div>
              )}
            </div>

            {group || failed ? (
              <div className="mt-6 flex flex-wrap items-center justify-between gap-3 border-t border-edge pt-5">
                <p className="text-sm text-faint">
                  {version ? `Latest release: ${version}` : "Latest release on GitHub"}
                </p>
                <a
                  href={releaseUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex h-9 items-center gap-2 rounded-lg border border-edge px-4 text-sm font-medium text-dim transition-colors hover:border-edge-strong hover:text-fg"
                >
                  All installers
                  <ExternalLink className="size-3.5" aria-hidden />
                </a>
              </div>
            ) : null}
          </div>
        </Reveal>
      </div>
    </section>
  );
}