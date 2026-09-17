export interface ReleaseAsset {
  name: string;
  size: number;
  browser_download_url: string;
}

export interface ReleaseInfo {
  tag_name: string;
  name: string;
  html_url: string;
  published_at: string;
  assets: ReleaseAsset[];
}

export const RELEASE_REPO = "irabizipaisiblevalentin/icode-editor";
export const RELEASES_URL = `https://github.com/${RELEASE_REPO}/releases/latest`;
const API_URL = `https://api.github.com/repos/${RELEASE_REPO}/releases/latest`;

export async function fetchLatestRelease(): Promise<ReleaseInfo | null> {
  try {
    const res = await fetch(API_URL, {
      headers: { Accept: "application/vnd.github+json" },
    });
    if (!res.ok) return null;
    const data = await res.json();
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
    };
  } catch {
    return null;
  }
}

export type PlatformId = "windows" | "macos" | "linux";
export type LinuxArch = "x64" | "arm64";

function isLinuxArch(name: string, arch: LinuxArch): boolean {
  return arch === "arm64"
    ? /arm64|aarch64/i.test(name)
    : /amd64|x64|x86_64|i686/i.test(name);
}

export type LinuxKind = "deb" | "rpm" | "tar";

export interface LinuxFile {
  arch: LinuxArch;
  kind: LinuxKind;
  asset: ReleaseAsset;
}

export interface DownloadGroup {
  windows?: ReleaseAsset;
  macos?: ReleaseAsset;
  linux: LinuxFile[];
}

const KIND_ORDER: LinuxKind[] = ["deb", "rpm", "tar"];

export function classifyAssets(assets: ReleaseAsset[]): DownloadGroup {
  const group: DownloadGroup = { linux: [] };
  for (const asset of assets) {
    const name = asset.name.toLowerCase();
    if (name.endsWith(".exe")) {
      if (!group.windows || /setup.*x64/.test(name)) group.windows = asset;
    } else if (name.endsWith(".dmg")) {
      if (!group.macos) group.macos = asset;
    } else if (
      name.endsWith(".deb") ||
      name.endsWith(".rpm") ||
      name.endsWith(".tar.gz")
    ) {
      const arch: LinuxArch | null = isLinuxArch(name, "arm64")
        ? "arm64"
        : isLinuxArch(name, "x64")
          ? "x64"
          : null;
      if (!arch) continue;
      const kind: LinuxKind = name.endsWith(".deb")
        ? "deb"
        : name.endsWith(".rpm")
          ? "rpm"
          : "tar";
      group.linux.push({ arch, kind, asset });
    }
  }
  group.linux.sort(
    (a, b) =>
      KIND_ORDER.indexOf(a.kind) - KIND_ORDER.indexOf(b.kind) ||
      a.arch.localeCompare(b.arch),
  );
  return group;
}

export function formatBytes(bytes: number): string {
  if (!bytes) return "";
  const mb = bytes / (1024 * 1024);
  return mb >= 1024 ? `${(mb / 1024).toFixed(1)} GB` : `${mb.toFixed(1)} MB`;
}