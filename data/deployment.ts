export type DeploymentEnvironment = "production" | "preview";

export type DeploymentStatus = "idle" | "preparing" | "building" | "deploying" | "ready" | "failed" | "cancelled";

export type DeploymentLogLevel = "info" | "success" | "error";

export type DeploymentLog = {
  timestamp: string;
  level: DeploymentLogLevel;
  message: string;
};

export type DeploymentRecord = {
  id: string;
  projectName: string;
  environment: DeploymentEnvironment;
  branch: string;
  commitSha: string;
  status: DeploymentStatus;
  createdAt: string;
  endedAt?: string;
  duration?: string;
  url?: string;
  buildCommand: string;
  outputDirectory: string;
  framework: string;
  autoDeployFromGithub: boolean;
  logs: DeploymentLog[];
};

export type DeploymentConfig = {
  environment: DeploymentEnvironment;
  branch: string;
  buildCommand: string;
  outputDirectory: string;
  framework: string;
  autoDeployFromGithub: boolean;
};

export type DeploymentSnapshot = {
  simulateFailure: boolean;
  config: DeploymentConfig;
  records: DeploymentRecord[];
  activeRecordId: string | null;
};

const seedClock = () => "09:41:22";

function seedLogs(status: "ready" | "failed" | "cancelled"): DeploymentLog[] {
  return buildDeploymentLogs(status, seedClock);
}

export type DeploymentProgressStep = {
  id: "preparing" | "building" | "deploying" | "ready";
  label: string;
  detail: string;
};

export const deploymentProgressSteps: DeploymentProgressStep[] = [
  { id: "preparing", label: "Preparing", detail: "Preparing deployment…" },
  { id: "building", label: "Building", detail: "Building your application…" },
  { id: "deploying", label: "Deploying", detail: "Publishing application…" },
  { id: "ready", label: "Ready", detail: "Deployment ready" },
];

export type DeploymentFramework = {
  id: string;
  label: string;
  buildCommand: string;
  outputDirectory: string;
};

export const deploymentFrameworks: DeploymentFramework[] = [
  { id: "next", label: "Next.js", buildCommand: "npm run build", outputDirectory: ".next" },
  { id: "react", label: "React (Vite)", buildCommand: "npm run build", outputDirectory: "dist" },
  { id: "static", label: "Static site", buildCommand: "npm run build", outputDirectory: "out" },
];

export const defaultDeploymentConfig: DeploymentConfig = {
  environment: "production",
  branch: "main",
  buildCommand: "npm run build",
  outputDirectory: ".next",
  framework: "Next.js",
  autoDeployFromGithub: true,
};

export function deploymentUrl(record: Pick<DeploymentRecord, "environment" | "projectName">): string {
  const slug = "saas-analytics";
  return record.environment === "production"
    ? `https://${slug}.architect-demo.app`
    : `https://preview--${slug}.architect-demo.app`;
}

const defaultClock = () => {
  const time = new Date();
  return time.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit", second: "2-digit" });
};

export function buildDeploymentLogs(status: Exclude<DeploymentStatus, "idle">, clock = defaultClock): DeploymentLog[] {
  const now = clock;
  const logs: DeploymentLog[] = [
    { timestamp: now(), level: "info", message: "Preparing application" },
    { timestamp: now(), level: "info", message: "Installing dependencies" },
    { timestamp: now(), level: "info", message: "Running production build" },
    { timestamp: now(), level: "info", message: "Uploading build" },
  ];
  if (status === "ready") {
    logs.push({ timestamp: now(), level: "success", message: "Publishing deployment" });
    logs.push({ timestamp: now(), level: "success", message: "Deployment ready" });
  } else if (status === "failed" || status === "cancelled") {
    logs.push({ timestamp: now(), level: "error", message: status === "failed" ? "The build could not be completed." : "Deployment cancelled." });
  }
  return logs;
}

let recordCounter = 3;
const nextRecordId = () => `dep-${++recordCounter}`;

export function deploymentRecordId(): string {
  return nextRecordId();
}

export function sortDeployments(records: DeploymentRecord[]): DeploymentRecord[] {
  return [...records].sort((a, b) => {
    const rank: Record<DeploymentStatus, number> = { idle: 0, preparing: 1, building: 2, deploying: 3, ready: 4, failed: 5, cancelled: 6 };
    const diff = rank[a.status] - rank[b.status];
    if (diff !== 0) return diff;
    return recordNumber(b.id) - recordNumber(a.id);
  });
}

function recordNumber(id: string): number {
  const match = id.match(/\d+/);
  return match ? Number(match[0]) : 0;
}

export const seedDeploymentRecords: DeploymentRecord[] = [
  {
    id: "dep-2",
    projectName: "SaaS Analytics",
    environment: "preview",
    branch: "feature/dashboard",
    commitSha: "b82c91a",
    status: "ready",
    createdAt: "18 minutes ago",
    endedAt: "17 minutes ago",
    duration: "1m 06s",
    buildCommand: "npm run build",
    outputDirectory: ".next",
    framework: "Next.js",
    autoDeployFromGithub: true,
    logs: seedLogs("ready"),
  },
  {
    id: "dep-1",
    projectName: "SaaS Analytics",
    environment: "production",
    branch: "main",
    commitSha: "a81d3f2",
    status: "ready",
    createdAt: "2 minutes ago",
    endedAt: "38 seconds ago",
    duration: "1m 24s",
    buildCommand: "npm run build",
    outputDirectory: ".next",
    framework: "Next.js",
    autoDeployFromGithub: true,
    logs: seedLogs("ready"),
  },
];

export const defaultDeploymentSnapshot: DeploymentSnapshot = {
  simulateFailure: false,
  config: { ...defaultDeploymentConfig },
  records: seedDeploymentRecords,
  activeRecordId: "dep-1",
};

export const deploymentSimulatedNote = "Deployment is simulated in prototype mode.";
export const liveUrlSimulatedNote = "Simulated live URL — this address does not host a real application.";
export const deploymentStepsById = (status: DeploymentStatus): DeploymentProgressStep["id"][] => {
  if (status === "preparing") return ["preparing"];
  if (status === "building") return ["preparing", "building"];
  if (status === "deploying") return ["preparing", "building", "deploying"];
  if (status === "ready") return ["preparing", "building", "deploying", "ready"];
  if (status === "failed" || status === "cancelled") return ["preparing", "building"];
  return [];
};