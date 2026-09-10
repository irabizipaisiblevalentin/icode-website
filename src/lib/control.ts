export interface PaymentRequest {
  id: string;
  full_name: string;
  phone_number?: string;
  email?: string;
  payment_method?: string;
  payment_amount?: string | number;
  transaction_reference?: string;
  created_at?: string;
  status: "PENDING" | "APPROVED" | "REJECTED";
  is_duplicate?: boolean;
  payment_proof?: string;
  payment_date?: string;
  payment_time?: string;
  admin_note?: string;
}

export interface PasscodeRecord {
  id: string;
  code_masked: string;
  type: "public" | "personal";
  created_at: string;
  expires_at: string;
  current_uses: number;
  max_uses?: number;
  note?: string;
  blocked: boolean;
}

export interface TrialRecord {
  machine_id: string;
  platform?: string;
  trial_started_at?: string;
  expires_at?: string;
  blocked?: boolean;
}

export interface AuditEntry {
  timestamp: string;
  action: string;
  actor_id?: string;
  target_id?: string;
}

export interface UserRecord {
  id: string;
  machine_id: string;
  hardware_id?: string | null;
  platform: string;
  arch: string;
  version?: string | null;
  passcode_id?: string | null;
  passcode_code?: string | null;
  passcode_type?: string | null;
  passcode_expires_at?: string | null;
  customer_name?: string | null;
  customer_email?: string | null;
  customer_phone?: string | null;
  trial_started_at?: string | null;
  registered_at: string;
  last_seen_at: string;
  blocked: number;
  block_reason?: string | null;
  usage_month: number;
}

export interface AdminStats {
  total: number;
  pending: number;
  approved: number;
  rejected: number;
  active_passcodes: number;
  expired_passcodes: number;
  total_users: number;
  online_users: number;
}

const TOKEN_KEY = "admin_token";
const NAME_KEY = "admin_name";
const MACHINE_KEY = "icode_machine_id";

// Control API origin. The SPA can be served from the Render instance itself
// (same origin) or from a static host such as Vercel (cross-origin, CORS is
// open on the server) — so default to the absolute Render origin, overridable
// via VITE_API_BASE at build time.
const RENDER_ORIGIN = "https://icode-s05p.onrender.com";
const API_BASE =
  (import.meta.env.VITE_API_BASE as string | undefined)?.trim().replace(/\/+$/, "") || RENDER_ORIGIN;

export class UnauthorizedError extends Error {
  constructor() {
    super("unauthorized");
    this.name = "UnauthorizedError";
  }
}

export class ApiError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "ApiError";
  }
}

export function getAdminToken(): string {
  try {
    return localStorage.getItem(TOKEN_KEY) ?? "";
  } catch {
    return "";
  }
}

export function setAdminToken(token: string) {
  try {
    localStorage.setItem(TOKEN_KEY, token);
  } catch {
    /* storage unavailable */
  }
}

export function clearAdminToken() {
  try {
    localStorage.removeItem(TOKEN_KEY);
  } catch {
    /* storage unavailable */
  }
}

export function getAdminName(): string {
  try {
    return localStorage.getItem(NAME_KEY) ?? "";
  } catch {
    return "";
  }
}

export function setAdminName(name: string) {
  try {
    localStorage.setItem(NAME_KEY, name);
  } catch {
    /* storage unavailable */
  }
}

export function getMachineId(): string {
  try {
    let id = localStorage.getItem(MACHINE_KEY);
    if (!id) {
      id = crypto.randomUUID();
      localStorage.setItem(MACHINE_KEY, id);
    }
    return id;
  } catch {
    return crypto.randomUUID();
  }
}

export function setMachineId(id: string) {
  try {
    localStorage.setItem(MACHINE_KEY, id);
  } catch {
    /* storage unavailable */
  }
}

interface ApiOptions {
  method?: string;
  body?: unknown;
  token?: string;
  signal?: AbortSignal;
}

async function base<T>(path: string, opts: ApiOptions, withAuth: boolean): Promise<T> {
  const headers: Record<string, string> = { "Content-Type": "application/json" };
  if (withAuth) {
    const token = opts.token ?? getAdminToken();
    if (token) headers.Authorization = `Bearer ${token}`;
  }
  const res = await fetch(API_BASE + path, {
    method: opts.method ?? "GET",
    headers,
    body: opts.body === undefined ? undefined : JSON.stringify(opts.body),
    signal: opts.signal,
  });
  if (res.status === 401 && withAuth) throw new UnauthorizedError();
  let data: any = null;
  try {
    data = await res.json();
  } catch {
    /* non-json body */
  }
  if (!res.ok) {
    throw new ApiError(data?.error ?? `Request failed (${res.status})`);
  }
  return data as T;
}

export const userApi = {
  validate: (body: { code: string; machine_id: string; platform: string; arch: string }) =>
    base<{
      ok: boolean;
      rate_limited?: boolean;
      reason?: "blocked" | "expired";
      message?: string;
      passcode_id?: string;
      expires_at?: string;
    }>("/v1/passcode/validate", { method: "POST", body }, false),
  activate: (body: { code: string; machine_id: string; platform: string; arch: string }) =>
    base<{
      ok: boolean;
      rate_limited?: boolean;
      reason?: "blocked" | "expired";
      message?: string;
      passcode_id?: string;
      expires_at?: string;
    }>("/v1/install/activate", { method: "POST", body }, false),
};

export const adminApi = {
  stats: () => base<AdminStats>("/v1/admin/dashboard/stats", {}, true),
  requests: () =>
    base<{ requests: PaymentRequest[] }>("/v1/admin/payment-requests", {}, true),
  approve: (id: string, verifiedBy: string) =>
    base<{ ok: boolean; passcode?: string; expiresAt?: string; message?: string }>(
      `/v1/admin/payment-requests/${id}/approve`,
      { method: "POST", body: { verifiedBy } },
      true,
    ),
  reject: (id: string, adminNote: string) =>
    base<{ ok: boolean; message?: string }>(
      `/v1/admin/payment-requests/${id}/reject`,
      { method: "POST", body: { adminNote } },
      true,
    ),
  passcodes: () => base<{ passcodes: PasscodeRecord[] }>("/v1/admin/passcodes", {}, true),
  generate: (type: "public" | "personal", note?: string) =>
    base<{ ok: boolean; code?: string; message?: string }>("/v1/admin/passcodes/generate", {
      method: "POST",
      body: { type, note: note || undefined },
    }, true),
  issue: (body: {
    name?: string;
    email?: string;
    reference?: string;
    phone?: string;
    days: number;
  }) =>
    base<
      | { ok: true; renewed?: boolean; customer: { name?: string }; passcode: { code: string; expires_at: string } }
      | { ok: false; error?: string }
    >("/v1/admin/passcodes/issue", { method: "POST", body }, true),
  revoke: (id: string) =>
    base<{ ok: boolean; message?: string }>(`/v1/admin/passcodes/${id}/revoke`, { method: "POST" }, true),
  reactivate: (id: string) =>
    base<{ ok: boolean; message?: string }>(`/v1/admin/passcodes/${id}/reactivate`, { method: "POST" }, true),
  trials: () => base<{ trials: TrialRecord[] }>("/v1/admin/trials", {}, true),
  users: () => base<{ users: UserRecord[] }>("/v1/admin/users", {}, true),
  blockInstall: (id: string, reason?: string) =>
    base<{ ok: boolean; message?: string }>(`/v1/admin/installs/${id}`, {
      method: "PATCH",
      body: { blocked: true, reason },
    }, true),
  unblockInstall: (id: string) =>
    base<{ ok: boolean; message?: string }>(`/v1/admin/installs/${id}`, {
      method: "PATCH",
      body: { blocked: false },
    }, true),
  audit: () => base<{ entries: AuditEntry[] }>("/v1/admin/audit-log", {}, true),
};

export function esc(value: unknown): string {
  return String(value ?? "").replace(/[&<>"']/g, (c) => {
    switch (c) {
      case "&":
        return "&amp;";
      case "<":
        return "&lt;";
      case ">":
        return "&gt;";
      case '"':
        return "&quot;";
      default:
        return "&#39;";
    }
  });
}

export function methodLabel(m?: string): string {
  if (!m) return "-";
  const map: Record<string, string> = {
    MTN_MOMO: "MTN MoMo",
    BK_BANK: "BK Bank",
    momo: "MoMo",
    bank: "Bank",
    MTN_MOBILE_MONEY: "MTN MoMo",
  };
  return map[m] ?? m;
}

// SQLite stores timestamps as UTC "YYYY-MM-DD HH:MM:SS" (no timezone marker).
// Parse those as UTC so relative-time and date display stay correct in any
// browser timezone.
export function parseDbDate(value?: string | null): number {
  if (!value) return 0;
  if (/^\d{4}-\d{2}-\d{2} \d{2}:\d{2}:\d{2}$/.test(value)) {
    const [d, t] = value.split(" ");
    const [y, m, day] = d.split("-").map(Number);
    const [h, min, s] = t.split(":").map(Number);
    return Date.UTC(y, m - 1, day, h, min, s);
  }
  const ts = Date.parse(value);
  return Number.isNaN(ts) ? 0 : ts;
}

export function formatDate(value?: string | null): string {
  if (!value) return "-";
  const ts = parseDbDate(value);
  if (!ts) return value.replace("T", " ");
  const d = new Date(ts);
  if (Number.isNaN(d.getTime())) return value;
  return d.toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric" });
}

export function formatDateTime(value?: string | null): string {
  if (!value) return "-";
  const ts = parseDbDate(value);
  if (!ts) return value;
  const d = new Date(ts);
  if (Number.isNaN(d.getTime())) return value;
  return d.toLocaleString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export function daysUntil(value?: string): number {
  if (!value) return 0;
  const d = new Date(value);
  if (Number.isNaN(d.getTime())) return 0;
  return Math.max(0, Math.ceil((d.getTime() - Date.now()) / (1000 * 60 * 60 * 24)));
}

export const PAYMENT_METHODS = [
  { name: "MTN Mobile Money", code: "1787240", owner: "Paisible Valentin" },
  { name: "BK Bank", code: "100269073874", owner: "Paisible Valentin Irabizi" },
] as const;

export const PAYMENT_FORM_URL = "https://forms.gle/48iUwJ2nCBU6uwQc8";
export const PRICE = "1,000 RWF";
export const TRIAL_WEEKS = "3-week";