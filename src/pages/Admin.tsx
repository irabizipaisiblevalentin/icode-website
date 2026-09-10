import { useCallback, useEffect, useMemo, useState } from "react";
import {
  ArrowLeft,
  Check,
  ChevronDown,
  Clock,
  Copy,
  CreditCard,
  ExternalLink,
  FlaskConical,
  KeyRound,
  LayoutDashboard,
  Loader2,
  LogOut,
  ScrollText,
  ShieldCheck,
  Users,
  Wrench,
} from "lucide-react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { Link, Navigate } from "react-router-dom";
import { Reveal } from "../components/animations/Reveal";
import {
  Badge,
  BTN_DANGER,
  BTN_PRIMARY,
  BTN_SECONDARY,
  BTN_SM,
  CARD,
  CodeChip,
  EmptyState,
  Field,
  INPUT_CLS,
  Modal,
  SELECT_CLS,
  Spinner,
  Stat,
  ToastHost,
  type ToastItem,
} from "../components/admin/ui";
import { useCopyCommand } from "../lib/hooks";
import { useDocumentTitle } from "../lib/route";
import { cn } from "../lib/cn";
import {
  adminApi,
  clearAdminToken,
  formatDate,
  formatDateTime,
  getAdminName,
  getAdminToken,
  methodLabel,
  UnauthorizedError,
  type AdminStats,
  type AuditEntry,
  type PasscodeRecord,
  type PaymentRequest,
  type TrialRecord,
  type UserRecord,
  parseDbDate,
} from "../lib/control";

type TabId = "dashboard" | "requests" | "passcodes" | "users" | "trials" | "tools" | "audit";

const TABS: { id: TabId; label: string; icon: typeof KeyRound }[] = [
  { id: "dashboard", label: "Dashboard", icon: LayoutDashboard },
  { id: "requests", label: "Requests", icon: CreditCard },
  { id: "passcodes", label: "Passcodes", icon: KeyRound },
  { id: "users", label: "Users", icon: Users },
  { id: "trials", label: "Trials", icon: FlaskConical },
  { id: "tools", label: "Tools", icon: Wrench },
  { id: "audit", label: "Audit Log", icon: ScrollText },
];

const TH = "px-4 py-3 text-left text-[11px] font-semibold uppercase tracking-wider text-faint whitespace-nowrap";
const TD = "px-4 py-3 text-[13px] text-dim whitespace-nowrap align-middle";

interface ConfirmState {
  title: string;
  text: string;
  yesLabel: string;
  danger: boolean;
  action: () => Promise<void>;
}

export function Admin() {
  useDocumentTitle("Admin — ICODE");
  const reduced = useReducedMotion();

  const [token, setTokenState] = useState(getAdminToken);
  const [adminName] = useState(getAdminName);
  const [tab, setTab] = useState<TabId>("dashboard");

  const [stats, setStats] = useState<AdminStats | null>(null);
  const [requests, setRequests] = useState<PaymentRequest[]>([]);
  const [passcodes, setPasscodes] = useState<PasscodeRecord[]>([]);
  const [trials, setTrials] = useState<TrialRecord[]>([]);
  const [users, setUsers] = useState<UserRecord[]>([]);
  const [audit, setAudit] = useState<AuditEntry[]>([]);

  const [loading, setLoading] = useState<Partial<Record<TabId, boolean>>>({});
  const [detail, setDetail] = useState<PaymentRequest | null>(null);
  const [confirm, setConfirm] = useState<ConfirmState | null>(null);
  const [confirmBusy, setConfirmBusy] = useState(false);
  const [codeModal, setCodeModal] = useState<{ code: string; expiresAt?: string } | null>(null);
  const [toasts, setToasts] = useState<ToastItem[]>([]);

  const toast = useCallback((message: string, kind: ToastItem["kind"] = "info") => {
    const id = Date.now() + Math.random();
    setToasts((t) => [...t, { id, message, kind }]);
    window.setTimeout(() => {
      setToasts((t) => t.filter((x) => x.id !== id));
    }, 4000);
  }, []);

  const handleFail = useCallback(
    (err: unknown) => {
      if (err instanceof UnauthorizedError) {
        clearAdminToken();
        setTokenState("");
        toast("Your token is no longer valid. Please re-enter it.", "error");
      } else {
        toast(err instanceof Error ? err.message : "Request failed", "error");
      }
    },
    [toast],
  );

  const loadStats = useCallback(async () => {
    setLoading((l) => ({ ...l, dashboard: true }));
    try {
      const s = await adminApi.stats();
      setStats(s);
    } catch (err) {
      handleFail(err);
    } finally {
      setLoading((l) => ({ ...l, dashboard: false }));
    }
  }, [handleFail]);

  const loadRequests = useCallback(async () => {
    setLoading((l) => ({ ...l, requests: true }));
    try {
      const d = await adminApi.requests();
      setRequests(d.requests);
    } catch (err) {
      handleFail(err);
    } finally {
      setLoading((l) => ({ ...l, requests: false }));
    }
  }, [handleFail]);

  const loadPasscodes = useCallback(async () => {
    setLoading((l) => ({ ...l, passcodes: true }));
    try {
      const d = await adminApi.passcodes();
      setPasscodes(d.passcodes);
    } catch (err) {
      handleFail(err);
    } finally {
      setLoading((l) => ({ ...l, passcodes: false }));
    }
  }, [handleFail]);

  const loadTrials = useCallback(async () => {
    setLoading((l) => ({ ...l, trials: true }));
    try {
      const d = await adminApi.trials();
      setTrials(d.trials);
    } catch (err) {
      handleFail(err);
    } finally {
      setLoading((l) => ({ ...l, trials: false }));
    }
  }, [handleFail]);

  const loadAudit = useCallback(async () => {
    setLoading((l) => ({ ...l, audit: true }));
    try {
      const d = await adminApi.audit();
      setAudit(d.entries);
    } catch (err) {
      handleFail(err);
    } finally {
      setLoading((l) => ({ ...l, audit: false }));
    }
  }, [handleFail]);

  const loadUsers = useCallback(async () => {
    setLoading((l) => ({ ...l, users: true }));
    try {
      const d = await adminApi.users();
      setUsers(d.users);
    } catch (err) {
      handleFail(err);
    } finally {
      setLoading((l) => ({ ...l, users: false }));
    }
  }, [handleFail]);

  const refreshCore = useCallback(() => {
    void loadStats();
    void loadRequests();
  }, [loadStats, loadRequests]);

  useEffect(() => {
    if (!token) return;
    void loadStats();
    void loadRequests();
  }, [token, loadStats, loadRequests]);

  useEffect(() => {
    if (tab === "dashboard") void loadStats();
    if (tab === "requests") void loadRequests();
    if (tab === "passcodes") void loadPasscodes();
    if (tab === "users") void loadUsers();
    if (tab === "trials") void loadTrials();
    if (tab === "audit") void loadAudit();
  }, [tab, loadStats, loadRequests, loadPasscodes, loadUsers, loadTrials, loadAudit]);

  const askConfirm = (c: ConfirmState) => setConfirm(c);
  const closeConfirm = () => {
    setConfirm(null);
    setConfirmBusy(false);
  };

  const runConfirm = async () => {
    if (!confirm) return;
    setConfirmBusy(true);
    try {
      await confirm.action();
      closeConfirm();
    } catch {
      closeConfirm();
    }
  };

  const approve = (r: PaymentRequest) =>
    askConfirm({
      title: "Confirm this payment?",
      text: `${r.full_name} submitted ${r.payment_amount ?? "1,000"} RWF. A passcode will be generated and shown for you to send.`,
      yesLabel: "Verify & approve",
      danger: false,
      action: async () => {
        const data = await adminApi.approve(r.id, adminName || "admin");
        toast("Payment verified", "success");
        refreshCore();
        if (data.passcode) setCodeModal({ code: data.passcode, expiresAt: data.expiresAt });
      },
    });

  const reject = (r: PaymentRequest) =>
    askConfirm({
      title: "Reject this request?",
      text: "Was the payment not correct? No passcode will be issued for this request.",
      yesLabel: "Reject",
      danger: true,
      action: async () => {
        await adminApi.reject(r.id, `Rejected by ${adminName || "admin"}`);
        toast("Request rejected", "warn");
        refreshCore();
      },
    });

  const revoke = (p: PasscodeRecord) =>
    askConfirm({
      title: "Revoke this access?",
      text: "This passcode will be revoked. The user will no longer be able to use ICODE with it.",
      yesLabel: "Revoke",
      danger: true,
      action: async () => {
        await adminApi.revoke(p.id);
        toast("Passcode revoked", "warn");
        void loadPasscodes();
      },
    });

  const reactivate = async (p: PasscodeRecord) => {
    try {
      await adminApi.reactivate(p.id);
      toast("Passcode reactivated", "success");
      void loadPasscodes();
    } catch (err) {
      handleFail(err);
    }
  };

  const blockUser = (u: UserRecord) =>
    askConfirm({
      title: "Block this user?",
      text: `"${u.customer_name || u.machine_id.slice(0, 8)}" will no longer be able to use ICODE on this machine.`,
      yesLabel: "Block",
      danger: true,
      action: async () => {
        await adminApi.blockInstall(u.id);
        toast("User blocked", "warn");
        void loadUsers();
        void loadStats();
      },
    });

  const unblockUser = async (u: UserRecord) => {
    try {
      await adminApi.unblockInstall(u.id);
      toast("User unblocked", "success");
      void loadUsers();
      void loadStats();
    } catch (err) {
      handleFail(err);
    }
  };

  const logout = () => {
    clearAdminToken();
    setTokenState("");
    setStats(null);
    setRequests([]);
    setPasscodes([]);
    setTrials([]);
    setUsers([]);
    setAudit([]);
  };

  return (
    <>
      <header className="relative pt-[8rem] sm:pt-[10rem]">
        <div className="shell">
          <Reveal variant="scale">
            <div className="mx-auto max-w-3xl text-center">
              <span className="eyebrow inline-flex items-center gap-2">
                <ShieldCheck className="size-3.5" aria-hidden />
                Control center
              </span>
              <h1 className="mt-4 text-[clamp(2.2rem,5.5vw,3.6rem)] leading-[1.05] font-semibold tracking-[-0.035em] text-balance text-gradient">
                ICODE <span className="text-gradient-accent">Admin</span>
              </h1>
              <p className="mt-4 text-[15px] leading-relaxed text-dim">
                Verify payments, manage passcodes, and monitor trials — all in one place.
              </p>
            </div>
          </Reveal>
        </div>
      </header>

      <section className="shell mt-10 pb-28 sm:mt-12 sm:pb-32">
        {!token ? (
          <Navigate to="/admin/login" replace />
        ) : (
          <div className="flex flex-col gap-5">
            <Reveal variant="fade">
              <div className="glass flex flex-wrap items-center justify-between gap-4 rounded-2xl p-4">
                <div className="flex items-center gap-3">
                  <span className="grid size-10 place-items-center rounded-xl border border-accent-500/25 bg-accent-500/10 text-accent-400">
                    <ShieldCheck className="size-5" aria-hidden />
                  </span>
                  <div>
                    <p className="text-sm font-semibold text-fg">
                      Signed in as <span className="text-accent-400">{adminName || "admin"}</span>
                    </p>
                    <p className="text-xs text-faint">
                      Session token stored on this device only.
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Link
                    to="/access"
                    className={cn(BTN_SECONDARY, BTN_SM)}
                  >
                    <ArrowLeft className="size-3.5" aria-hidden />
                    Access page
                  </Link>
                  <button type="button" onClick={logout} className={cn(BTN_DANGER, BTN_SM)}>
                    <LogOut className="size-3.5" aria-hidden />
                    Sign out
                  </button>
                </div>
              </div>
            </Reveal>

            <Reveal variant="fade" delay={0.05}>
              <div className="relative flex gap-1 overflow-x-auto rounded-2xl border border-edge bg-white/[0.02] p-1.5">
                {TABS.map((t) => (
                  <button
                    key={t.id}
                    type="button"
                    onClick={() => setTab(t.id)}
                    className={cn(
                      "relative flex shrink-0 items-center gap-2 rounded-xl px-4 py-2.5 text-sm font-medium transition-colors",
                      tab === t.id ? "text-fg" : "text-faint hover:text-dim",
                    )}
                  >
                    {tab === t.id && (
                      <motion.span
                        layoutId="admin-tab"
                        transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
                        className="absolute inset-0 rounded-xl border border-accent-500/30 bg-accent-500/10"
                      />
                    )}
                    <t.icon className="relative size-4" aria-hidden />
                    <span className="relative">{t.label}</span>
                  </button>
                ))}
              </div>
            </Reveal>

            <AnimatePresence mode="wait">
              <motion.div
                key={tab}
                initial={reduced ? false : { opacity: 0, y: 10 }}
                animate={reduced ? undefined : { opacity: 1, y: 0 }}
                exit={reduced ? undefined : { opacity: 0, y: -6 }}
                transition={{ duration: 0.25, ease: "easeOut" }}
                className="flex flex-col gap-5"
              >
                {tab === "dashboard" && (
                  <>
                    <StatsGrid stats={stats} loading={loading.dashboard} />
                    <RequestsPanel
                      requests={requests}
                      loading={loading.requests}
                      embedded
                      onView={setDetail}
                      onApprove={approve}
                      onReject={reject}
                    />
                  </>
                )}
                {tab === "requests" && (
                  <RequestsPanel
                    requests={requests}
                    loading={loading.requests}
                    onView={setDetail}
                    onApprove={approve}
                    onReject={reject}
                  />
                )}
                {tab === "passcodes" && (
                  <PasscodesPanel
                    passcodes={passcodes}
                    loading={loading.passcodes}
                    onRevoke={revoke}
                    onReactivate={reactivate}
                  />
                )}
                {tab === "users" && (
                  <UsersPanel
                    users={users}
                    loading={loading.users}
                    onBlock={(u) => blockUser(u)}
                    onUnblock={(u) => void unblockUser(u)}
                  />
                )}
                {tab === "trials" && <TrialsPanel trials={trials} loading={loading.trials} />}
                {tab === "tools" && (
                  <ToolsPanel
                    handleFail={handleFail}
                    toast={toast}
                    onIssued={() => void loadPasscodes()}
                  />
                )}
                {tab === "audit" && <AuditPanel entries={audit} loading={loading.audit} />}
              </motion.div>
            </AnimatePresence>
          </div>
        )}
      </section>

      <DetailModal
        request={detail}
        onClose={() => setDetail(null)}
        onApprove={() => {
          if (detail) approve(detail);
        }}
        onReject={() => {
          if (detail) reject(detail);
        }}
      />

      <Modal open={!!confirm} onClose={closeConfirm} title={confirm?.title ?? ""}>
        {confirm && (
          <>
            <p className="text-sm leading-relaxed text-dim">{confirm.text}</p>
            <div className="mt-6 flex justify-end gap-2">
              <button type="button" onClick={closeConfirm} className={BTN_SECONDARY}>
                Cancel
              </button>
              <button
                type="button"
                onClick={() => void runConfirm()}
                disabled={confirmBusy}
                className={cn(confirm.danger ? BTN_DANGER : BTN_PRIMARY)}
              >
                {confirmBusy && <Loader2 className="size-4 animate-spin" aria-hidden />}
                {confirm.yesLabel}
              </button>
            </div>
          </>
        )}
      </Modal>

      <Modal open={!!codeModal} onClose={() => setCodeModal(null)} title="Payment approved">
        {codeModal && (
          <div>
            <p className="text-sm leading-relaxed text-dim">
              Passcode generated successfully. Send it to the user with the expiry date.
            </p>
            <CodeReveal code={codeModal.code} expiresAt={codeModal.expiresAt} />
          </div>
        )}
      </Modal>

      <ToastHost toasts={toasts} onDismiss={(id) => setToasts((t) => t.filter((x) => x.id !== id))} />
    </>
  );
}

function StatsGrid({ stats, loading }: { stats: AdminStats | null; loading?: boolean }) {
  if (loading && !stats) return <Spinner label="Loading statistics…" />;
  return (
    <>
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        <Stat label="Total requests" value={stats?.total ?? 0} />
        <Stat label="Pending" value={stats?.pending ?? 0} tone="warn" />
        <Stat label="Approved" value={stats?.approved ?? 0} tone="accent" />
        <Stat label="Rejected" value={stats?.rejected ?? 0} tone="danger" />
        <Stat label="Total users" value={stats?.total_users ?? 0} tone="accent" />
        <Stat label="Online now" value={stats?.online_users ?? 0} tone="accent" />
        <Stat label="Active passcodes" value={stats?.active_passcodes ?? 0} tone="accent" />
        <Stat label="Expired passcodes" value={stats?.expired_passcodes ?? 0} />
      </div>
      {!!stats && stats.total_users === 0 && stats.approved > 0 && (
        <p className="rounded-xl border border-accent-500/25 bg-accent-500/[0.06] px-4 py-3 text-xs leading-relaxed text-dim">
          Approved customers won't appear under <span className="text-accent-300">Total users</span> until they actually
          run iCode on their machine and enter the passcode. They already show under{" "}
          <span className="text-accent-300">Requests</span> (status: Approved) and{" "}
          <span className="text-accent-300">Passcodes</span>.
        </p>
      )}
    </>
  );
}

function reqStatusBadge(status: string): { label: string; status: string } {
  if (status === "PENDING") return { label: "Pending", status: "PENDING" };
  if (status === "APPROVED") return { label: "Approved", status: "APPROVED" };
  return { label: "Rejected", status: "REJECTED" };
}

interface RequestsPanelProps {
  requests: PaymentRequest[];
  loading?: boolean;
  embedded?: boolean;
  onView: (r: PaymentRequest) => void;
  onApprove: (r: PaymentRequest) => void;
  onReject: (r: PaymentRequest) => void;
}

function RequestsPanel({ requests, loading, embedded, onView, onApprove, onReject }: RequestsPanelProps) {
  const [query, setQuery] = useState("");
  const [filter, setFilter] = useState<"ALL" | "PENDING" | "APPROVED" | "REJECTED">("ALL");

  const list = useMemo(() => {
    const q = query.trim().toLowerCase();
    return requests.filter((r) => {
      if (filter !== "ALL" && r.status !== filter) return false;
      if (!q) return true;
      return [r.full_name, r.phone_number, r.email, r.transaction_reference]
        .filter(Boolean)
        .some((v) => (v as string).toLowerCase().includes(q));
    });
  }, [requests, query, filter]);

  const filters = ["ALL", "PENDING", "APPROVED", "REJECTED"] as const;

  return (
    <div className={CARD}>
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 className="text-[15px] font-semibold tracking-tight text-fg">
            {embedded ? "Payment requests" : "All requests"}
          </h2>
          <p className="mt-0.5 text-xs text-faint">
            {requests.length} submission{requests.length === 1 ? "" : "s"} from the Google Form.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <div className="relative">
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              type="text"
              placeholder="Search name, phone, email, tx…"
              className={cn(INPUT_CLS, "w-56 pr-8")}
            />
            <ChevronDown className="pointer-events-none absolute right-3 top-1/2 size-4 -translate-y-1/2 text-faint" aria-hidden />
          </div>
        </div>
      </div>

      <div className="mt-4 flex flex-wrap gap-2">
        {filters.map((f) => (
          <button
            key={f}
            type="button"
            onClick={() => setFilter(f)}
            className={cn(
              "rounded-lg border px-3 py-1.5 text-xs font-medium transition-colors",
              filter === f
                ? "border-accent-500/40 bg-accent-500/10 text-accent-300"
                : "border-edge text-faint hover:text-dim",
            )}
          >
            {f === "ALL" ? "All" : f}
          </button>
        ))}
      </div>

      <div className="mt-4">
        {loading && requests.length === 0 ? (
          <Spinner label="Loading requests…" />
        ) : list.length === 0 ? (
          <EmptyState message={requests.length === 0 ? "No requests yet" : "No matching requests"} />
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[900px] border-collapse">
              <thead>
                <tr className="border-b border-edge">
                  <th className={TH}>Name</th>
                  <th className={TH}>Phone</th>
                  <th className={TH}>Method</th>
                  <th className={TH}>Amount</th>
                  <th className={TH}>Transaction</th>
                  <th className={TH}>Date</th>
                  <th className={TH}>Status</th>
                  <th className={TH}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {list.map((r) => {
                  const b = reqStatusBadge(r.status);
                  return (
                    <tr key={r.id} className="border-b border-edge/60 transition-colors hover:bg-white/[0.02]">
                      <td className={TD}>
                        <span className="font-medium text-fg">{r.full_name}</span>
                        {r.is_duplicate && (
                          <Badge status="dup">
                            <span className="ml-1">dup</span>
                          </Badge>
                        )}
                      </td>
                      <td className={TD}>{r.phone_number || "-"}</td>
                      <td className={TD}>{methodLabel(r.payment_method)}</td>
                      <td className={cn(TD, "font-mono text-fg")}>{r.payment_amount ?? "-"} RWF</td>
                      <td className={TD}>
                        <CodeChip>{r.transaction_reference || "-"}</CodeChip>
                      </td>
                      <td className={TD}>{formatDateTime(r.created_at)}</td>
                      <td className={TD}>
                        <Badge status={b.status}>{b.label}</Badge>
                      </td>
                      <td className={cn(TD, "whitespace-nowrap")}>
                        <div className="flex items-center gap-1.5">
                          <button type="button" onClick={() => onView(r)} className={cn(BTN_SECONDARY, BTN_SM)}>
                            View
                          </button>
                          {r.status === "PENDING" && (
                            <>
                              <button type="button" onClick={() => onApprove(r)} className={cn(BTN_PRIMARY, BTN_SM)}>
                                Approve
                              </button>
                              <button type="button" onClick={() => onReject(r)} className={cn(BTN_DANGER, BTN_SM)}>
                                Reject
                              </button>
                            </>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}

function DetailModal({
  request,
  onClose,
  onApprove,
  onReject,
}: {
  request: PaymentRequest | null;
  onClose: () => void;
  onApprove: () => void;
  onReject: () => void;
}) {
  const rows: [string, React.ReactNode][] = request
    ? [
        ["Full name", request.full_name],
        ["Email", request.email || "-"],
        ["Phone", request.phone_number || "-"],
        ["Method", methodLabel(request.payment_method)],
        ["Amount", `${request.payment_amount ?? "-"} RWF`],
        [
          "Transaction",
          request.transaction_reference ? <CodeChip>{request.transaction_reference}</CodeChip> : "-",
        ],
        ["Payment date", request.payment_date || "-"],
        ["Payment time", request.payment_time || "-"],
      ]
    : [];
  return (
    <Modal open={!!request} onClose={onClose} title="Payment request details" wide>
      {request && (
        <div>
          <h4 className="mt-1 text-xs font-bold uppercase tracking-wider text-accent-400">
            Applicant
          </h4>
          <dl className="mt-3 grid gap-x-6 gap-y-3 sm:grid-cols-2">
            {rows.map(([k, v]) => (
              <div key={k} className="flex flex-col gap-0.5">
                <dt className="text-[11px] uppercase tracking-wider text-faint">{k}</dt>
                <dd className="text-sm text-fg">{v}</dd>
              </div>
            ))}
          </dl>

          {request.payment_proof && (
            <>
              <h4 className="mt-6 text-xs font-bold uppercase tracking-wider text-accent-400">
                Payment proof
              </h4>
              <a
                href={request.payment_proof}
                target="_blank"
                rel="noopener noreferrer"
                className={cn(BTN_SECONDARY, BTN_SM, "mt-3")}
              >
                View proof
                <ExternalLink className="size-3.5" aria-hidden />
              </a>
            </>
          )}

          {request.is_duplicate && (
            <p className="mt-4 rounded-lg border border-yellow-500/40 bg-yellow-500/10 px-3 py-2 text-xs text-yellow-300">
              Possible duplicate payment — this transaction reference was already submitted.
            </p>
          )}
          {request.admin_note && (
            <p className="mt-4 rounded-lg border border-edge bg-white/[0.03] px-3 py-2 text-xs text-dim">
              Admin note: {request.admin_note}
            </p>
          )}

          <div className="mt-6 flex justify-end gap-2">
            {request.status === "PENDING" ? (
              <>
                <button type="button" onClick={onApprove} className={BTN_PRIMARY}>
                  Verify & approve
                </button>
                <button type="button" onClick={onReject} className={BTN_DANGER}>
                  Reject
                </button>
                <button type="button" onClick={onClose} className={BTN_SECONDARY}>
                  Back
                </button>
              </>
            ) : (
              <button type="button" onClick={onClose} className={BTN_SECONDARY}>
                Back
              </button>
            )}
          </div>
        </div>
      )}
    </Modal>
  );
}

function passcodeStatus(p: PasscodeRecord): { label: string; status: string } {
  if (p.blocked) return { label: "Revoked", status: "revoked" };
  if (new Date(p.expires_at) < new Date()) return { label: "Expired", status: "expired" };
  return { label: "Active", status: "active" };
}

function PasscodesPanel({
  passcodes,
  loading,
  onRevoke,
  onReactivate,
}: {
  passcodes: PasscodeRecord[];
  loading?: boolean;
  onRevoke: (p: PasscodeRecord) => void;
  onReactivate: (p: PasscodeRecord) => void;
}) {
  const now = new Date();
  const active = passcodes.filter((p) => !p.blocked && new Date(p.expires_at) > now).length;
  const blocked = passcodes.filter((p) => p.blocked).length;

  return (
    <>
      <div className="grid grid-cols-2 gap-3 sm:max-w-sm">
        <Stat label="Active" value={active} tone="accent" />
        <Stat label="Revoked" value={blocked} tone="danger" />
      </div>
      <div className={CARD}>
        <div>
          <h2 className="text-[15px] font-semibold tracking-tight text-fg">Passcodes</h2>
          <p className="mt-0.5 text-xs text-faint">
            Public (trial) and personal passcodes issued to users.
          </p>
        </div>
        <div className="mt-4">
          {loading && passcodes.length === 0 ? (
            <Spinner label="Loading passcodes…" />
          ) : passcodes.length === 0 ? (
            <EmptyState message="No passcodes yet" />
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full min-w-[820px] border-collapse">
                <thead>
                  <tr className="border-b border-edge">
                    <th className={TH}>Code</th>
                    <th className={TH}>Type</th>
                    <th className={TH}>Created</th>
                    <th className={TH}>Status</th>
                    <th className={TH}>Expires</th>
                    <th className={TH}>Uses</th>
                    <th className={TH}>Note</th>
                    <th className={TH}>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {passcodes.map((p) => {
                    const s = passcodeStatus(p);
                    return (
                      <tr key={p.id} className="border-b border-edge/60 transition-colors hover:bg-white/[0.02]">
                        <td className={TD}>
                          <CodeChip>{p.code_masked}</CodeChip>
                        </td>
                        <td className={TD}>
                          <Badge status={`${p.type}`}>{p.type}</Badge>
                        </td>
                        <td className={TD}>{formatDate(p.created_at)}</td>
                        <td className={TD}>
                          <Badge status={s.status}>{s.label}</Badge>
                        </td>
                        <td className={TD}>{formatDate(p.expires_at)}</td>
                        <td className={cn(TD, "font-mono")}>
                          {p.current_uses}
                          {p.max_uses ? `/${p.max_uses}` : ""}
                        </td>
                        <td className={cn(TD, "max-w-[180px] overflow-hidden text-ellipsis")}>{p.note || "-"}</td>
                        <td className={cn(TD, "whitespace-nowrap")}>
                          {p.blocked ? (
                            <button type="button" onClick={() => onReactivate(p)} className={cn(BTN_SECONDARY, BTN_SM)}>
                              Reactivate
                            </button>
                          ) : (
                            <button type="button" onClick={() => onRevoke(p)} className={cn(BTN_DANGER, BTN_SM)}>
                              Revoke
                            </button>
                          )}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </>
  );
}

function TrialsPanel({ trials, loading }: { trials: TrialRecord[]; loading?: boolean }) {
  const now = new Date();
  const withStatus = trials.map((t) => ({
    ...t,
    expired: !!(t.expires_at && new Date(t.expires_at) < now),
  }));
  const active = withStatus.filter((t) => !t.expired).length;
  const expired = withStatus.filter((t) => t.expired).length;

  return (
    <>
      <div className="grid grid-cols-2 gap-3 sm:max-w-sm">
        <Stat label="Active trials" value={active} tone="accent" />
        <Stat label="Ended / expiring" value={expired} tone="danger" />
      </div>
      <div className={CARD}>
        <div>
          <h2 className="text-[15px] font-semibold tracking-tight text-fg">Free trials</h2>
          <p className="mt-0.5 text-xs text-faint">
            Machines that started a free trial. Remind them to pay 1,000 RWF before it ends.
          </p>
        </div>
        <div className="mt-4">
          {loading && trials.length === 0 ? (
            <Spinner label="Loading trials…" />
          ) : trials.length === 0 ? (
            <EmptyState message="No trials yet" />
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full min-w-[640px] border-collapse">
                <thead>
                  <tr className="border-b border-edge">
                    <th className={TH}>Machine</th>
                    <th className={TH}>Platform</th>
                    <th className={TH}>Trial started</th>
                    <th className={TH}>Expires</th>
                    <th className={TH}>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {withStatus.map((t, i) => (
                    <tr key={t.machine_id || i} className="border-b border-edge/60 transition-colors hover:bg-white/[0.02]">
                      <td className={TD}>
                        <CodeChip>{(t.machine_id || "").slice(0, 8)}</CodeChip>
                      </td>
                      <td className={TD}>{t.platform || "-"}</td>
                      <td className={TD}>
                        <span className="inline-flex items-center gap-1.5">
                          <Clock className="size-3.5 text-faint" aria-hidden />
                          {formatDate(t.trial_started_at)}
                        </span>
                      </td>
                      <td className={TD}>{formatDate(t.expires_at)}</td>
                      <td className={TD}>
                        {t.blocked ? (
                          <Badge status="revoked">Blocked</Badge>
                        ) : t.expired ? (
                          <Badge status="expired">Ended / expired</Badge>
                        ) : (
                          <Badge status="active">Active</Badge>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </>
  );
}

type UserStatusId = "online" | "recent" | "offline" | "blocked";

const ONLINE_MS = 5 * 60 * 1000;
const ACTIVE_MS = 24 * 60 * 60 * 1000;

function userStatus(u: UserRecord): { id: UserStatusId; label: string; badge: string } {
  if (u.blocked) return { id: "blocked", label: "Blocked", badge: "revoked" };
  const ts = parseDbDate(u.last_seen_at);
  if (ts > Date.now() - ONLINE_MS) return { id: "online", label: "Online", badge: "active" };
  if (ts > Date.now() - ACTIVE_MS) return { id: "recent", label: "Active", badge: "public" };
  return { id: "offline", label: "Offline", badge: "expired" };
}

function relativeTime(value?: string | null): string {
  const ts = parseDbDate(value ?? "");
  if (!ts) return "-";
  const diff = Math.max(0, Date.now() - ts);
  if (diff < 60_000) return "just now";
  const m = Math.floor(diff / 60_000);
  if (m < 60) return `${m}m ago`;
  const h = Math.floor(m / 60);
  if (h < 24) return `${h}h ago`;
  const d = Math.floor(h / 24);
  return `${d}d ago`;
}

function usageLabel(seconds: number): string {
  const mins = Math.round(seconds / 60);
  if (mins <= 0) return "—";
  if (mins < 60) return `${mins}m`;
  return `${(mins / 60).toFixed(1)}h`;
}

function UsersPanel({
  users,
  loading,
  onBlock,
  onUnblock,
}: {
  users: UserRecord[];
  loading?: boolean;
  onBlock: (u: UserRecord) => void;
  onUnblock: (u: UserRecord) => Promise<void> | void;
}) {
  const [query, setQuery] = useState("");
  const [filter, setFilter] = useState<UserStatusId | "all">("all");

  const list = useMemo(() => {
    const q = query.trim().toLowerCase();
    return users.filter((u) => {
      const s = userStatus(u);
      if (filter !== "all" && s.id !== filter) return false;
      if (!q) return true;
      return [
        u.customer_name,
        u.customer_email,
        u.machine_id,
        u.platform,
        u.passcode_code,
      ]
        .filter(Boolean)
        .some((v) => String(v).toLowerCase().includes(q));
    });
  }, [users, query, filter]);

  const now = Date.now();
  const total = users.length;
  const online = users.filter((u) => !u.blocked && parseDbDate(u.last_seen_at) > now - ONLINE_MS).length;
  const recent = users.filter((u) => !u.blocked && parseDbDate(u.last_seen_at) > now - ACTIVE_MS).length;
  const blocked = users.filter((u) => u.blocked).length;

  const filters: { id: UserStatusId | "all"; label: string }[] = [
    { id: "all", label: "All" },
    { id: "online", label: "Online" },
    { id: "recent", label: "Active" },
    { id: "offline", label: "Offline" },
    { id: "blocked", label: "Blocked" },
  ];

  return (
    <>
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        <Stat label="Total users" value={total} tone="accent" />
        <Stat label="Online now" value={online} tone="accent" />
        <Stat label="Active (24h)" value={recent} />
        <Stat label="Blocked" value={blocked} tone="danger" />
      </div>
      <div className={CARD}>
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <h2 className="text-[15px] font-semibold tracking-tight text-fg">Users</h2>
            <p className="mt-0.5 text-xs text-faint">
              Everyone using ICODE, with their access and activity this month.
            </p>
          </div>
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            type="text"
            placeholder="Search name, email, machine, platform…"
            className={cn(INPUT_CLS, "w-full sm:w-72")}
          />
        </div>

        <div className="mt-4 flex flex-wrap gap-2">
          {filters.map((f) => (
            <button
              key={f.id}
              type="button"
              onClick={() => setFilter(f.id)}
              className={cn(
                "rounded-lg border px-3 py-1.5 text-xs font-medium transition-colors",
                filter === f.id
                  ? "border-accent-500/40 bg-accent-500/10 text-accent-300"
                  : "border-edge text-faint hover:text-dim",
              )}
            >
              {f.label}
            </button>
          ))}
        </div>

        <div className="mt-4">
          {loading && users.length === 0 ? (
            <Spinner label="Loading users…" />
          ) : list.length === 0 ? (
            <EmptyState message={users.length === 0 ? "No users yet" : "No matching users"} />
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full min-w-[980px] border-collapse">
                <thead>
                  <tr className="border-b border-edge">
                    <th className={TH}>User</th>
                    <th className={TH}>Machine</th>
                    <th className={TH}>Access</th>
                    <th className={TH}>Status</th>
                    <th className={TH}>Registered</th>
                    <th className={TH}>Last seen</th>
                    <th className={TH}>This month</th>
                    <th className={TH}>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {list.map((u) => {
                    const s = userStatus(u);
                    return (
                      <tr key={u.id} className="border-b border-edge/60 transition-colors hover:bg-white/[0.02]">
                        <td className={TD}>
                          <div className="flex flex-col">
                            <span className="font-medium text-fg">
                              {u.customer_name || "Trial / unregistered"}
                            </span>
                            {u.customer_email && (
                              <span className="text-xs text-faint">{u.customer_email}</span>
                            )}
                          </div>
                        </td>
                        <td className={TD}>
                          <div className="flex flex-col gap-1">
                            <CodeChip>{u.machine_id.slice(0, 8)}</CodeChip>
                            <span className="text-xs text-faint">
                              {u.platform || "-"}
                              {u.version ? ` · v${u.version}` : ""}
                            </span>
                          </div>
                        </td>
                        <td className={TD}>
                          {u.blocked ? (
                            <Badge status="revoked">Blocked</Badge>
                          ) : u.passcode_code ? (
                            <div className="flex flex-col items-start gap-1">
                              <Badge status={`${u.passcode_type}`}>{u.passcode_type}</Badge>
                              <span className="text-xs text-faint">
                                {formatDate(u.passcode_expires_at)}
                              </span>
                            </div>
                          ) : u.trial_started_at ? (
                            <div className="flex flex-col items-start gap-1">
                              <Badge status="public">Trial</Badge>
                              <span className="text-xs text-faint">
                                {formatDate(u.trial_started_at)}
                              </span>
                            </div>
                          ) : (
                            <Badge status="expired">Registered</Badge>
                          )}
                        </td>
                        <td className={TD}>
                          <Badge status={s.badge}>{s.label}</Badge>
                        </td>
                        <td className={TD}>{formatDate(u.registered_at)}</td>
                        <td className={TD}>
                          <span className="inline-flex items-center gap-1.5">
                            <Clock className="size-3.5 text-faint" aria-hidden />
                            {relativeTime(u.last_seen_at)}
                          </span>
                        </td>
                        <td className={cn(TD, "font-mono")}>{usageLabel(u.usage_month)}</td>
                        <td className={cn(TD, "whitespace-nowrap")}>
                          {u.blocked ? (
                            <button type="button" onClick={() => void onUnblock(u)} className={cn(BTN_SECONDARY, BTN_SM)}>
                              Unblock
                            </button>
                          ) : (
                            <button type="button" onClick={() => onBlock(u)} className={cn(BTN_DANGER, BTN_SM)}>
                              Block
                            </button>
                          )}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </>
  );
}

function AuditPanel({ entries, loading }: { entries: AuditEntry[]; loading?: boolean }) {
  return (
    <div className={CARD}>
      <div>
        <h2 className="text-[15px] font-semibold tracking-tight text-fg">Audit log</h2>
        <p className="mt-0.5 text-xs text-faint">
          Every admin action is recorded with the actor who performed it.
        </p>
      </div>
      <div className="mt-4">
        {loading && entries.length === 0 ? (
          <Spinner label="Loading audit log…" />
        ) : entries.length === 0 ? (
          <EmptyState message="No log entries" />
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[640px] border-collapse">
              <thead>
                <tr className="border-b border-edge">
                  <th className={TH}>Timestamp</th>
                  <th className={TH}>Action</th>
                  <th className={TH}>Actor</th>
                  <th className={TH}>Target</th>
                </tr>
              </thead>
              <tbody>
                {entries.map((e, i) => (
                  <tr key={i} className="border-b border-edge/60 transition-colors hover:bg-white/[0.02]">
                    <td className={cn(TD, "font-mono text-xs text-faint")}>{formatDateTime(e.timestamp)}</td>
                    <td className={TD}>
                      <CodeChip>{e.action}</CodeChip>
                    </td>
                    <td className={TD}>{e.actor_id || "-"}</td>
                    <td className={cn(TD, "max-w-[240px] overflow-hidden text-ellipsis")}>{e.target_id || "-"}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}

function CodeReveal({ code, expiresAt }: { code: string; expiresAt?: string }) {
  const { copied, failed, copy } = useCopyCommand();
  return (
    <div className="mt-4">
      <div className="rounded-xl border border-dashed border-accent-500/50 bg-black/40 px-4 py-5 text-center">
        <span className="break-all font-mono text-xl font-bold tracking-[0.15em] text-accent-400">
          {code}
        </span>
      </div>
      <p className="mt-2 text-center text-xs text-faint">
        {expiresAt ? `Expires ${formatDateTime(expiresAt)}` : " "}
      </p>
      <button type="button" onClick={() => void copy(code)} className={cn(BTN_SECONDARY, "mt-3 w-full")}>
        {copied ? (
          <>
            <Check className="size-4 text-accent-400" aria-hidden />
            Copied
          </>
        ) : (
          <>
            <Copy className="size-4" aria-hidden />
            {failed ? "Copy failed" : "Copy passcode"}
          </>
        )}
      </button>
    </div>
  );
}

interface ToolsPanelProps {
  handleFail: (err: unknown) => void;
  toast: (message: string, kind?: ToastItem["kind"]) => void;
  onIssued: () => void;
}

function ToolsPanel({ handleFail, toast, onIssued }: ToolsPanelProps) {
  return (
    <div className="grid gap-5 lg:grid-cols-2">
      <GenerateCard handleFail={handleFail} toast={toast} />
      <IssueCard handleFail={handleFail} toast={toast} onIssued={onIssued} />
    </div>
  );
}

function GenerateCard({
  handleFail,
  toast,
}: {
  handleFail: (err: unknown) => void;
  toast: (message: string, kind?: ToastItem["kind"]) => void;
}) {
  const [type, setType] = useState<"public" | "personal">("public");
  const [note, setNote] = useState("");
  const [busy, setBusy] = useState(false);
  const [result, setResult] = useState<string | null>(null);
  const { copied, failed, copy } = useCopyCommand();

  const generate = async () => {
    setBusy(true);
    setResult(null);
    try {
      const data = await adminApi.generate(type, note || undefined);
      if (data.code) {
        setResult(data.code);
        toast("Passcode generated", "success");
      } else {
        toast(data.message || "Failed to generate", "error");
      }
    } catch (err) {
      handleFail(err);
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className={CARD}>
      <h2 className="text-[15px] font-semibold tracking-tight text-fg">Generate passcode</h2>
      <p className="mt-0.5 text-xs text-faint">
        Create a public (trial) or personal passcode directly.
      </p>
      <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-[auto_1fr_auto]">
        <select value={type} onChange={(e) => setType(e.target.value as "public" | "personal")} className={SELECT_CLS}>
          <option value="public">Public (3 weeks)</option>
          <option value="personal">Personal (paid)</option>
        </select>
        <input
          value={note}
          onChange={(e) => setNote(e.target.value)}
          type="text"
          placeholder="Note (optional)"
          className={INPUT_CLS}
        />
        <button type="button" onClick={() => void generate()} disabled={busy} className={BTN_PRIMARY}>
          {busy && <Loader2 className="size-4 animate-spin" aria-hidden />}
          Generate
        </button>
      </div>
      {result && (
        <div className="mt-4 rounded-xl border border-dashed border-accent-500/40 bg-accent-500/[0.06] p-4">
          <p className="text-xs text-faint">Generated passcode</p>
          <div className="mt-1 flex items-center justify-between gap-3">
            <span className="break-all font-mono text-lg font-bold tracking-widest text-accent-400">{result}</span>
            <button
              type="button"
              onClick={() => void copy(result)}
              className={cn(BTN_SECONDARY, BTN_SM, "shrink-0")}
            >
              {copied ? <Check className="size-3.5 text-accent-400" /> : <Copy className="size-3.5" />}
              {copied ? "Copied" : failed ? "Failed" : "Copy"}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

function IssueCard({
  handleFail,
  toast,
  onIssued,
}: {
  handleFail: (err: unknown) => void;
  toast: (message: string, kind?: ToastItem["kind"]) => void;
  onIssued: () => void;
}) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [ref, setRef] = useState("");
  const [phone, setPhone] = useState("");
  const [days, setDays] = useState(30);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [result, setResult] = useState<{ code: string; expiresAt: string; renewed?: boolean; name?: string } | null>(null);
  const { copied, failed, copy } = useCopyCommand();

  const issue = async () => {
    if (!email.trim() && !ref.trim()) {
      setError("Provide at least an email or a reference.");
      return;
    }
    setError("");
    setBusy(true);
    setResult(null);
    try {
      const data = await adminApi.issue({
        name: name || undefined,
        email: email || undefined,
        reference: ref || undefined,
        phone: phone || undefined,
        days,
      });
      if (data.ok) {
        setResult({
          code: data.passcode.code,
          expiresAt: data.passcode.expires_at,
          renewed: data.renewed,
          name: data.customer.name,
        });
        toast(data.renewed ? "Passcode renewed for this customer" : "Passcode issued", "success");
        onIssued();
      } else {
        setError(data.error || "Failed to issue passcode");
      }
    } catch (err) {
      handleFail(err);
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className={CARD}>
      <h2 className="text-[15px] font-semibold tracking-tight text-fg">Issue passcode for a paying customer</h2>
      <p className="mt-0.5 text-xs text-faint">
        Fill this after you confirm payment from the Google Form. Renews the same customer if they already have one.
      </p>
      <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2">
        <Field label="Full name">
          <input value={name} onChange={(e) => setName(e.target.value)} type="text" className={INPUT_CLS} />
        </Field>
        <Field label="Email (for matching)">
          <input value={email} onChange={(e) => setEmail(e.target.value)} type="email" className={INPUT_CLS} />
        </Field>
        <Field label="Order / reference">
          <input value={ref} onChange={(e) => setRef(e.target.value)} type="text" className={INPUT_CLS} />
        </Field>
        <Field label="Phone (optional)">
          <input value={phone} onChange={(e) => setPhone(e.target.value)} type="text" className={INPUT_CLS} />
        </Field>
      </div>
      <div className="mt-3 flex flex-wrap items-end gap-3">
        <Field label="Duration">
          <select
            value={days}
            onChange={(e) => setDays(Number(e.target.value))}
            className={cn(SELECT_CLS, "min-w-32")}
          >
            <option value={30}>30 days</option>
            <option value={60}>60 days</option>
            <option value={90}>90 days</option>
            <option value={7}>7 days</option>
            <option value={365}>1 year</option>
          </select>
        </Field>
        <button type="button" onClick={() => void issue()} disabled={busy} className={cn(BTN_PRIMARY, "flex-1 sm:flex-none")}>
          {busy && <Loader2 className="size-4 animate-spin" aria-hidden />}
          Issue passcode
        </button>
      </div>
      {error && <p className="mt-3 text-xs text-red-400">{error}</p>}
      {result && (
        <div className="mt-4 rounded-xl border border-dashed border-accent-500/40 bg-accent-500/[0.06] p-4">
          <p className="text-xs text-faint">
            {result.renewed ? "Renewed passcode" : "New passcode"} for {result.name || "customer"}
          </p>
          <div className="mt-1 flex items-center justify-between gap-3">
            <span className="break-all font-mono text-lg font-bold tracking-widest text-accent-400">{result.code}</span>
            <button
              type="button"
              onClick={() => void copy(result.code)}
              className={cn(BTN_SECONDARY, BTN_SM, "shrink-0")}
            >
              {copied ? <Check className="size-3.5 text-accent-400" /> : <Copy className="size-3.5" />}
              {copied ? "Copied" : failed ? "Failed" : "Copy"}
            </button>
          </div>
          <p className="mt-1.5 text-xs text-faint">Expires {formatDateTime(result.expiresAt)}</p>
        </div>
      )}
    </div>
  );
}