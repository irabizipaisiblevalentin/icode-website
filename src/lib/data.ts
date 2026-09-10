export const INSTALL_COMMAND = "npm install -g @vln.codes__/icode";
export const LAUNCH_COMMAND = "icode";

export const NAV_LINKS = [
  { label: "Product", to: "/#product" },
  { label: "Features", to: "/#features" },
  { label: "Installation", to: "/installation" },
  { label: "Activate", to: "/activate" },
  { label: "Pricing", to: "/pricing" },
] as const;

export const OS_OPTIONS = [
  { id: "windows", label: "Windows", icon: "windows" },
  { id: "macos", label: "macOS", icon: "apple" },
  { id: "linux", label: "Linux", icon: "linux" },
] as const;

export type OsId = (typeof OS_OPTIONS)[number]["id"];

export const OS_DETAILS: Record<
  OsId,
  { shell: string; note: string; verifying: string[] }
> = {
  windows: {
    shell: "Command Prompt, PowerShell, or Windows Terminal",
    note: "If npm is not recognized, reopen your terminal after installing Node.js, or add the npm directory to your PATH.",
    verifying: ["npm --version", "icode --version"],
  },
  macos: {
    shell: "Terminal (macOS)",
    note: "macOS includes a terminal app. After installing Node.js, this command works in any shell, including zsh.",
    verifying: ["npm --version", "icode --version"],
  },
  linux: {
    shell: "Your distribution's terminal emulator",
    note: "Node.js via your package manager or the official installer. The icode command is made available globally.",
    verifying: ["npm --version", "icode --version"],
  },
};

export const FEATURES = [
  {
    icon: "sparkles",
    title: "AI-Powered Coding",
    body: "Bring an AI coding agent into your terminal to build, reason about, and improve your code where you already write it.",
  },
  {
    icon: "terminal",
    title: "Terminal First",
    body: "No separate web app to juggle. ICODE runs inside the terminal you already use every day, keeping your flow intact.",
  },
  {
    icon: "zap",
    title: "Fast Installation",
    body: "A single global npm command and ICODE is ready. No platform installer, no daemon, no background services.",
  },
  {
    icon: "workflow",
    title: "Developer Workflow",
    body: "Designed around real software workflows: start a session, describe what you are building, and let ICODE work with you.",
  },
  {
    icon: "seconds",
    title: "Modern Experience",
    body: "A polished, keyboard-driven interface built for developers who want tools that respect their time and attention.",
  },
  {
    icon: "globe",
    title: "Cross-Platform",
    body: "Runs on Windows, macOS, and Linux. One codebase, one command, the same experience wherever you develop.",
  },
] as const;

export const HOW_IT_WORKS = [
  {
    step: "01",
    title: "Install",
    body: "Install ICODE globally with a single npm command. Node.js is the only prerequisite.",
  },
  {
    step: "02",
    title: "Launch",
    body: "Run icode in any terminal. Your interactive ICODE session opens instantly.",
  },
  {
    step: "03",
    title: "Build",
    body: "Describe what you are working on. ICODE helps you build, debug, and refactor your project.",
  },
  {
    step: "04",
    title: "Ship",
    body: "Your work stays in your workflow. From first edit to shipped feature, ICODE stays with you.",
  },
] as const;

export const TRIAL_FLOW = [
  { label: "Install", caption: "npm install -g @vln.codes__/icode" },
  { label: "Run ICODE", caption: "icode" },
  { label: "3-Week Trial", caption: "Free access starts" },
  { label: "Use ICODE", caption: "Build without limits" },
  { label: "Trial Ends", caption: "Access page appears" },
  { label: "Enter Admin Passcode", caption: "Provided by your administrator" },
  { label: "Continue Using ICODE", caption: "Unlock continued access" },
] as const;

export const PRICE = "1000 RWF";
export const TRIAL_DURATION = "3-week trial";