import { useEffect, useRef, useState, type KeyboardEvent, type ReactNode } from "react"
import { motion } from "framer-motion"
import {
  Download,
  ExternalLink,
  FileArchive,
  Package,
  CircleAlert,
  Chrome,
  Monitor,
  Terminal,
} from "lucide-react"
import { SectionHeading } from "../ui/SectionHeading"
import { Reveal } from "../animations/Reveal"
import { usePrefersReducedMotion } from "../../lib/hooks"
import {
  type Arch,
  type DownloadGroup,
  type LinuxKind,
  type PlatformId,
  RELEASES_URL,
  classifyAssets,
  fetchLatestRelease,
  formatBytes,
} from "../../lib/download"
import { cn } from "../../lib/cn"

const PLATFORMS: { id: PlatformId; label: string }[] = [
  { id: "windows", label: "Windows" },
  { id: "macos", label: "macOS" },
  { id: "linux", label: "Linux" },
  { id: "chromeos", label: "ChromeOS" },
]

const PLATFORM_ICONS: Record<PlatformId, ReactNode> = {
  windows: <Monitor className="size-4" aria-hidden />,
  macos: (
    <svg viewBox="0 0 24 24" className="size-4 fill-none" aria-hidden>
      <path
        d="M16.2 12.9c0-2.3 1.9-3.4 2-3.5-1.1-1.6-2.8-1.8-3.4-1.9-1.4-.1-2.8.9-3.5.9-.7 0-1.8-.8-3-.8-1.5 0-2.9.9-3.7 2.2-1.6 2.7-.4 6.7 1.1 8.9.7 1.1 1.6 2.4 2.8 2.3 1.1 0 1.5-.7 2.9-.7s1.7.7 2.9.7c1.2 0 2-1.1 2.7-2.2.8-1.3 1.2-2.5 1.2-2.6-.1 0-2.1-.8-2-3.3"
        className="fill-current"
      />
      <ellipse cx="14.6" cy="5.9" rx="1.7" ry="2" className="fill-current" />
    </svg>
  ),
  linux: (
    <svg viewBox="0 0 24 24" className="size-4 fill-none" aria-hidden>
      <path
        d="M9.5 20.5s.5.9 1.8.7c1.1-.2 1.2-1 2.4-1s1.4.8 2.4 1c1.3.2 1.8-.7 1.8-.7M8 14.5c.6.4 1.5.3 1.9 0M16 14.5m-1.6 0c.5.3 1.3.4 1.7 0M10.4 16.5h3.2"
        stroke="currentColor"
        strokeWidth="1.4"
        strokeLinecap="round"
        className="stroke-current"
      />
      <path
        d="M7.5 11.5c-.6-.5-1.2-1.7-1.3-2.8-.1-1.3.6-2.4 1.4-2.2.9.2 1 .4.7 1.1-.3.8-1.3 3.4-1 4.6"
        className="fill-current opacity-80"
      />
      <path
        d="M16.5 11.5c.6-.5 1.2-1.7 1.3-2.8.1-1.3-.6-2.4-1.4-2.2-.9.2-1 .4-.7 1.1.3.8 1.3 3.4 1 4.6"
        className="fill-current opacity-80"
      />
      <path
        d="M8.8 13.9c-1.3.6-2.4 1.4-2.9 2.6-.5 1.3-.9 3.2-.4 4.7M15.2 13.9c1.3.6 2.5 1.5 3 2.6.2.7.2 1.5.1 2.3M8.4 13.4c.1-1.7.9-2.8 1.7-3.2.8-.4 2-.4 3.4-.4.9 0 2.1.1 2.8.6.7.4 1.2 1.3 1.3 2.5"
        stroke="currentColor"
        strokeWidth="1.4"
        strokeLinecap="round"
        className="stroke-current"
      />
    </svg>
  ),
  chromeos: <Chrome className="size-4" aria-hidden />,
}

const LINUX_KINDS: { kind: LinuxKind; label: string; hint: string }[] = [
  { kind: "deb", label: ".deb", hint: "Debian · Ubuntu · ChromeOS" },
  { kind: "appimage", label: "AppImage", hint: "Any distro · no install needed" },
  { kind: "tar", label: "tar.gz", hint: "Portable archive" },
  { kind: "rpm", label: ".rpm", hint: "Fedora · RHEL" },
]

const KIND_ICONS: Record<LinuxKind, ReactNode> = {
  deb: <Package className="size-4" aria-hidden />,
  appimage: <Download className="size-4" aria-hidden />,
  rpm: <Package className="size-4" aria-hidden />,
  tar: <FileArchive className="size-4" aria-hidden />,
}

interface DownloadButtonProps {
  href: string
  label: string
  size?: string
  primary?: boolean
  icon?: ReactNode
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
  )
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
  )
}

function EmptyPlatform({ platform, href }: { platform: PlatformId; href: string }) {
  const label = PLATFORMS.find((p) => p.id === platform)?.label ?? "That"
  return (
    <div className="flex items-start gap-3 rounded-xl border border-edge bg-white/[0.02] p-4 text-sm leading-relaxed text-dim">
      <CircleAlert className="mt-0.5 size-4 shrink-0 text-accent-400" aria-hidden />
      <p>
        The {label} installer is not in the latest release yet — it is still being published.{" "}
        <a
          href={href}
          target="_blank"
          rel="noopener noreferrer"
          className="font-medium text-accent-400 transition-colors hover:text-accent-300"
        >
          Watch the release on GitHub
        </a>
        .
      </p>
    </div>
  )
}

const ARCH_LABEL: Record<Arch, string> = {
  x64: "Intel / AMD 64-bit",
  arm64: "ARM 64-bit",
}

export function DownloadSection({ className }: { className?: string }) {
  const reduced = usePrefersReducedMotion()
  const [platform, setPlatform] = useState<PlatformId>("windows")
  const [group, setGroup] = useState<DownloadGroup | null>(null)
  const [version, setVersion] = useState<string>("")
  const [releaseUrl, setReleaseUrl] = useState<string>(RELEASES_URL)
  const [failed, setFailed] = useState(false)
  const refs = useRef<Record<PlatformId, HTMLButtonElement | null>>(
    {} as Record<PlatformId, HTMLButtonElement | null>,
  )

  useEffect(() => {
    let alive = true
    void fetchLatestRelease().then((release) => {
      if (!alive) return
      if (!release || release.assets.length === 0) {
        setFailed(true)
        return
      }
      setGroup(classifyAssets(release.assets))
      setVersion(release.tag_name)
      setReleaseUrl(release.html_url || RELEASES_URL)
    })
    return () => {
      alive = false
    }
  }, [])

  const select = (id: PlatformId) => {
    setPlatform(id)
    refs.current[id]?.focus()
  }

  const onKeyDown = (event: KeyboardEvent, id: PlatformId) => {
    const order = PLATFORMS.map((p) => p.id)
    const index = order.indexOf(id)
    if (!["ArrowLeft", "ArrowRight", "Home", "End"].includes(event.key)) return
    event.preventDefault()
    let next = index
    if (event.key === "ArrowRight") next = (index + 1) % order.length
    if (event.key === "ArrowLeft") next = (index - 1 + order.length) % order.length
    if (event.key === "Home") next = 0
    if (event.key === "End") next = order.length - 1
    select(order[next])
  }

  const linuxByArch = (arch: Arch) =>
    (group?.linux ?? []).filter((f) => f.arch === arch)

  const chromeosFiles = (arch: Arch) =>
    linuxByArch(arch).filter((f) => f.kind === "deb" || f.kind === "appimage")

  const platformEmpty = (id: PlatformId): boolean => {
    if (!group) return false
    if (id === "windows") return group.windows.length === 0
    if (id === "macos") return group.macos.length === 0
    if (id === "linux") return group.linux.length === 0
    return chromeosFiles("x64").length === 0 && chromeosFiles("arm64").length === 0
  }

  return (
    <section id="download" className={cn("relative scroll-mt-24", className)}>
      <div className="shell">
        <SectionHeading
          eyebrow="Desktop app"
          title="Download iCode for desktop"
          description={
            version
              ? `Native installers for Windows, macOS, Linux and ChromeOS. Version ${version} — the engine and the free models router are built in.`
              : "Native installers for Windows, macOS, Linux and ChromeOS — the engine and the free models router are built in."
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
                const selected = platform === p.id
                return (
                  <button
                    key={p.id}
                    ref={(el) => {
                      refs.current[p.id] = el
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
                      {PLATFORM_ICONS[p.id]}
                      {p.label}
                    </span>
                  </button>
                )
              })}
            </div>

            <div id="dl-panel" role="tabpanel" aria-labelledby={`dl-tab-${platform}`} className="mt-6">
              {group ? (
                <>
                  {platform === "windows" && group.windows.length > 0 ? (
                    <div className="flex flex-col gap-3">
                      {group.windows.map((file) => (
                        <PlatformCard
                          key={file.asset.name}
                          asset={file.asset}
                          note={`${ARCH_LABEL[file.arch]} · Windows 10 and 11${file.arch === "arm64" ? " on ARM" : ""} · User or system installer`}
                        />
                      ))}
                      <p className="max-w-2xl text-sm leading-relaxed text-faint">
                        Downloads are unsigned, so Windows may show SmartScreen. Click
                        <span className="mx-1 rounded border border-edge bg-white/[0.04] px-1.5 py-0.5 font-mono text-xs text-dim">More info</span>
                        then <span className="font-mono text-dim">Run anyway</span>.
                      </p>
                    </div>
                  ) : null}

                  {platform === "macos" ? (
                    <div className="flex flex-col gap-3">
                      {group.macos.filter((f) => f.kind === "dmg").map((file) => (
                        <PlatformCard
                          key={file.asset.name}
                          asset={file.asset}
                          note={`${file.arch === "arm64" ? "Apple Silicon (arm64)" : "Intel (x64)"} · macOS 12 and later`}
                        />
                      ))}
                      {group.macos.filter((f) => f.kind === "zip").length > 0 ? (
                        <div className="flex flex-wrap gap-2">
                          {group.macos
                            .filter((f) => f.kind === "zip")
                            .map((file) => (
                              <a
                                key={file.asset.name}
                                href={file.asset.browser_download_url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-flex h-9 items-center gap-2 rounded-lg border border-edge-strong bg-white/[0.04] px-4 text-xs font-mono text-dim transition-colors hover:border-accent-500/50 hover:text-fg"
                              >
                                {file.arch} .zip
                                <span className="text-faint">{formatBytes(file.asset.size)}</span>
                              </a>
                            ))}
                        </div>
                      ) : null}
                      {group.macos.length > 0 ? (
                        <p className="max-w-2xl text-sm leading-relaxed text-faint">
                          The app is not notarized. Right-click the app in Finder (or
                          open it via <span className="font-mono text-dim">Control-click</span>) and choose
                          <span className="ml-1 rounded border border-edge bg-white/[0.04] px-1.5 py-0.5 font-mono text-xs text-dim">Open</span>
                          to launch it the first time.
                        </p>
                      ) : null}
                    </div>
                  ) : null}

                  {platform === "linux" ? (
                    <div className="flex flex-col gap-5">
                      {(["x64", "arm64"] as const).map((arch) => {
                        const files = linuxByArch(arch)
                        if (files.length === 0) return null
                        return (
                          <div key={arch}>
                            <p className="mb-2.5 flex items-center gap-2 font-mono text-xs uppercase tracking-[0.16em] text-faint">
                              {ARCH_LABEL[arch]}
                              <span className="rounded-full border border-accent-500/30 bg-accent-500/10 px-2 py-0.5 font-mono text-[10px] normal-case tracking-wider text-accent-400">
                                {arch}
                              </span>
                            </p>
                            <div className="flex flex-col gap-3 sm:grid sm:grid-cols-3">
                              {LINUX_KINDS.map(({ kind, label, hint }) => {
                                const file = files.find((f) => f.kind === kind)
                                if (!file) return null
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
                                )
                              })}
                            </div>
                          </div>
                        )
                      })}
                      {!platformEmpty("linux") ? (
                        <p className="max-w-2xl text-sm leading-relaxed text-faint">
                          The AppImage runs anywhere without installing — mark it
                          executable (<span className="font-mono text-dim">chmod +x</span>) and double-click, or use
                          your distro's package manager with the{" "}
                          <span className="font-mono text-dim">.deb</span>.
                        </p>
                      ) : null}
                    </div>
                  ) : null}

                  {platform === "chromeos" && !platformEmpty("chromeos") ? (
                    <div className="flex flex-col gap-4">
                      <div className="flex items-start gap-3 rounded-2xl border border-edge bg-white/[0.02] p-4">
                        <Terminal className="mt-0.5 size-4 shrink-0 text-accent-400" aria-hidden />
                        <ol className="list-decimal space-y-1.5 pl-4 text-sm leading-relaxed text-dim">
                          <li>
                            Turn on the Linux container:{" "}
                            <span className="text-fg">Settings → Advanced → Developers → Linux development environment → Turn on</span>.
                          </li>
                          <li>
                            Download the <span className="font-mono text-fg">.deb</span> for your Chromebook's
                            architecture — Intel/AMD Chromebooks use x64 (amd64), ARM Chromebooks use arm64. If in
                            doubt, check <span className="text-fg">Settings → About ChromeOS → Additional details</span> or
                            try the amd64 build first:
                          </li>
                        </ol>
                      </div>
                      <code className="block overflow-x-auto rounded-xl border border-edge bg-black/40 px-4 py-3 font-mono text-xs text-dim">
                        sudo dpkg -i ~/Downloads/&lt;your-downloaded-file&gt;.deb && sudo apt --fix-broken install
                      </code>
                      <div className="flex flex-col gap-4">
                        {(["x64", "arm64"] as const).map((arch) => {
                          const files = linuxByArch(arch).filter((f) => f.kind === "deb" || f.kind === "appimage")
                          if (files.length === 0) return null
                          return (
                            <div key={arch}>
                              <p className="mb-2.5 flex items-center gap-2 font-mono text-xs uppercase tracking-[0.16em] text-faint">
                                {ARCH_LABEL[arch]}
                                <span className="rounded-full border border-accent-500/30 bg-accent-500/10 px-2 py-0.5 font-mono text-[10px] normal-case tracking-wider text-accent-400">
                                  {arch}
                                </span>
                              </p>
                              <div className="flex flex-col gap-3 sm:grid sm:grid-cols-2">
                                {files.map((file) => (
                                  <a
                                    key={file.asset.name}
                                    href={file.asset.browser_download_url}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="glass group flex flex-col gap-1 rounded-2xl p-4 transition-colors hover:border-accent-500/40"
                                  >
                                    <span className="flex items-center gap-2 font-mono text-[13px] text-fg">
                                      {KIND_ICONS[file.kind]}
                                      {LINUX_KINDS.find((k) => k.kind === file.kind)?.label}
                                    </span>
                                    <span className="text-xs text-faint">
                                      {file.kind === "deb" ? "Install with dpkg" : "Run after chmod +x"}
                                    </span>
                                    <span className="mt-2 font-mono text-xs text-accent-400">
                                      {formatBytes(file.asset.size)} · Download
                                    </span>
                                  </a>
                                ))}
                              </div>
                            </div>
                          )
                        })}
                      </div>
                    </div>
                  ) : null}

                  {platformEmpty(platform) ? (
                    <EmptyPlatform platform={platform} href={releaseUrl} />
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
  )
}
