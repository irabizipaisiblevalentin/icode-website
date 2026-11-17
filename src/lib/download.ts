export interface ReleaseAsset {
  name: string
  size: number
  browser_download_url: string
}

export interface ReleaseInfo {
  tag_name: string
  name: string
  html_url: string
  published_at: string
  assets: ReleaseAsset[]
}

// The desktop app ships its installers from its own release repo — the old
// VS Code–like editor releases are gone from this site.
export const RELEASE_REPO = "irabizipaisiblevalentin/icode-desktop"
export const RELEASES_URL = `https://github.com/${RELEASE_REPO}/releases/latest`
const API_URL = `https://api.github.com/repos/${RELEASE_REPO}/releases/latest`

export async function fetchLatestRelease(): Promise<ReleaseInfo | null> {
  try {
    const res = await fetch(API_URL, {
      headers: { Accept: "application/vnd.github+json" },
    })
    if (!res.ok) return null
    const data = await res.json()
    return {
      tag_name: data.tag_name,
      name: data.name ?? data.tag_name,
      html_url: data.html_url,
      published_at: data.published_at,
      assets: (data.assets ?? []).map(
        (a: { name: string; size: number; browser_download_url: string }) => ({
          name: a.name,
          size: a.size,
          browser_download_url: a.browser_download_url,
        }),
      ),
    }
  } catch {
    return null
  }
}

export type PlatformId = "windows" | "macos" | "linux" | "chromeos"
export type Arch = "x64" | "arm64"

function archOf(name: string): Arch | null {
  if (/arm64|aarch64/i.test(name)) return "arm64"
  if (/x64|x86_64|amd64|i686/i.test(name)) return "x64"
  return null
}

export type LinuxKind = "deb" | "appimage" | "tar" | "rpm"

export interface LinuxFile {
  arch: Arch
  kind: LinuxKind
  asset: ReleaseAsset
}

export type MacKind = "dmg" | "zip"

export interface MacFile {
  arch: Arch
  kind: MacKind
  asset: ReleaseAsset
}

export interface WindowsFile {
  arch: Arch
  asset: ReleaseAsset
}

export interface DownloadGroup {
  windows: WindowsFile[]
  macos: MacFile[]
  linux: LinuxFile[]
}

const LINUX_KIND_ORDER: LinuxKind[] = ["deb", "appimage", "tar", "rpm"]

function sortLinux(a: LinuxFile, b: LinuxFile) {
  return (
    LINUX_KIND_ORDER.indexOf(a.kind) - LINUX_KIND_ORDER.indexOf(b.kind) ||
    a.arch.localeCompare(b.arch)
  )
}

export function classifyAssets(assets: ReleaseAsset[]): DownloadGroup {
  const group: DownloadGroup = { windows: [], macos: [], linux: [] }
  for (const asset of assets) {
    const name = asset.name.toLowerCase()
    const arch = archOf(asset.name)
    if (name.endsWith(".exe")) {
      group.windows.push({ arch: arch ?? "x64", asset })
    } else if (name.endsWith(".dmg")) {
      group.macos.push({ arch: arch ?? "arm64", kind: "dmg", asset })
    } else if (name.endsWith(".zip")) {
      group.macos.push({ arch: arch ?? "arm64", kind: "zip", asset })
    } else if (name.endsWith(".appimage")) {
      if (arch) group.linux.push({ arch, kind: "appimage", asset })
    } else if (name.endsWith(".deb") || name.endsWith(".rpm") || name.endsWith(".tar.gz")) {
      if (!arch) continue
      const kind: LinuxKind = name.endsWith(".deb")
        ? "deb"
        : name.endsWith(".rpm")
          ? "rpm"
          : "tar"
      group.linux.push({ arch, kind, asset })
    }
  }
  group.windows.sort((a, b) => a.arch.localeCompare(b.arch))
  group.macos.sort(
    (a, b) =>
      (a.kind === "dmg" ? 0 : 1) - (b.kind === "dmg" ? 0 : 1) ||
      (a.arch === "arm64" ? 0 : 1) - (b.arch === "arm64" ? 0 : 1),
  )
  group.linux.sort(sortLinux)
  return group
}

export function formatBytes(bytes: number): string {
  if (!bytes) return ""
  const mb = bytes / (1024 * 1024)
  return mb >= 1024 ? `${(mb / 1024).toFixed(1)} GB` : `${mb.toFixed(1)} MB`
}
