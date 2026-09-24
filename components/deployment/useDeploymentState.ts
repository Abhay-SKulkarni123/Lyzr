"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import {
  buildDeploymentLogs,
  defaultDeploymentConfig,
  defaultDeploymentSnapshot,
  deploymentRecordId,
  deploymentSimulatedNote,
  deploymentUrl,
  type DeploymentConfig,
  type DeploymentEnvironment,
  type DeploymentRecord,
  type DeploymentStatus,
} from "@/data/deployment";
import { clearDeploymentSnapshot, loadDeploymentSnapshot, saveDeploymentSnapshot } from "@/lib/deployment-storage";

export type DeployInput = {
  projectName: string;
  environment: DeploymentEnvironment;
  branch: string;
  commitSha: string;
};

type UseDeploymentStateArgs = {
  onNotice?: (message: string) => void;
};

const isBusyStatus = (status: DeploymentStatus) => status === "preparing" || status === "building" || status === "deploying";

export function useDeploymentState({ onNotice }: UseDeploymentStateArgs) {
  const [snapshot, setSnapshot] = useState(() => loadDeploymentSnapshot());

  const timersRef = useRef<number[]>([]);
  const runTokenRef = useRef(0);
  const simulateRef = useRef(snapshot.simulateFailure);
  simulateRef.current = snapshot.simulateFailure;

  function clearTimers() {
    for (const timer of timersRef.current) window.clearTimeout(timer);
    timersRef.current = [];
  }

  function chain(ms: number, fn: () => void) {
    const timer = window.setTimeout(fn, ms);
    timersRef.current.push(timer);
  }

  useEffect(() => {
    saveDeploymentSnapshot(snapshot);
  }, [snapshot]);

  useEffect(
    () => () => {
      for (const timer of timersRef.current) window.clearTimeout(timer);
    },
    []
  );

  function patchRecord(id: string, patch: Partial<DeploymentRecord>) {
    setSnapshot((prev) => ({
      ...prev,
      records: prev.records.map((record) => (record.id === id ? { ...record, ...patch } : record)),
    }));
  }

  function startRun(input: DeployInput, config: DeploymentConfig): string | null {
    const record: DeploymentRecord = {
      id: deploymentRecordId(),
      projectName: input.projectName,
      environment: input.environment,
      branch: input.branch,
      commitSha: input.commitSha,
      status: "preparing",
      createdAt: "Just now",
      buildCommand: config.buildCommand,
      outputDirectory: config.outputDirectory,
      framework: config.framework,
      autoDeployFromGithub: config.autoDeployFromGithub,
      logs: buildDeploymentLogs("preparing"),
    };
    setSnapshot((prev) => ({ ...prev, records: [record, ...prev.records], activeRecordId: record.id }));
    return record.id;
  }

  function advance(recordId: string, recordInput: DeployInput, config: DeploymentConfig, forceSuccess: boolean) {
    clearTimers();
    const token = ++runTokenRef.current;
    const isCurrent = () => runTokenRef.current === token;

    if (!forceSuccess && simulateRef.current) {
      chain(1600, () => {
        if (!isCurrent()) return;
        patchRecord(recordId, { status: "failed", endedAt: "Just now", logs: buildDeploymentLogs("failed") });
        onNotice?.("Deployment failed (simulated).");
      });
      return;
    }

    chain(800, () => {
      if (!isCurrent()) return;
      patchRecord(recordId, { status: "building", logs: buildDeploymentLogs("building") });
      chain(900, () => {
        if (!isCurrent()) return;
        patchRecord(recordId, { status: "deploying", logs: buildDeploymentLogs("deploying") });
        chain(1000, () => {
          if (!isCurrent()) return;
          patchRecord(recordId, {
            status: "ready",
            endedAt: "Just now",
            duration: `${Math.floor(1 + Math.random() * 2)}m ${Math.floor(Math.random() * 40 + 10)}s`,
            url: deploymentUrl({ environment: recordInput.environment, projectName: recordInput.projectName }),
            logs: buildDeploymentLogs("ready"),
          });
          const url = deploymentUrl({ environment: recordInput.environment, projectName: recordInput.projectName });
          onNotice?.(`Deployment ready — ${recordInput.environment} · ${recordInput.branch} · ${url} (simulated).`);
        });
      });
    });
  }

  function deploy(input: Partial<DeployInput> = {}, config?: DeploymentConfig) {
    const active = snapshot.activeRecordId ? snapshot.records.find((record) => record.id === snapshot.activeRecordId) : undefined;
    if (active && isBusyStatus(active.status)) return;
    const runConfig = config ?? snapshot.config;
    const run: DeployInput = {
      projectName: input.projectName ?? "SaaS Analytics",
      environment: input.environment ?? runConfig.environment,
      branch: input.branch ?? runConfig.branch,
      commitSha: input.commitSha ?? "a81d3f2",
    };
    const id = startRun(run, runConfig);
    if (id) advance(id, run, runConfig, false);
    onNotice?.(`Deployment started — ${run.environment} · ${run.branch} (simulated).`);
  }

  function retry() {
    const active = snapshot.activeRecordId ? snapshot.records.find((record) => record.id === snapshot.activeRecordId) : undefined;
    if (!active) {
      deploy({});
      return;
    }
    if (isBusyStatus(active.status)) return;
    setSnapshot((prev) => ({
      ...prev,
      config: {
        ...prev.config,
        environment: active.environment,
        branch: active.branch,
        buildCommand: active.buildCommand,
        outputDirectory: active.outputDirectory,
        framework: active.framework,
      },
    }));
    patchRecord(active.id, {
      status: "preparing",
      endedAt: undefined,
      duration: undefined,
      url: undefined,
      logs: buildDeploymentLogs("preparing"),
    });
    const run: DeployInput = {
      projectName: active.projectName,
      environment: active.environment,
      branch: active.branch,
      commitSha: active.commitSha,
    };
    advance(active.id, run, snapshot.config, true);
    onNotice?.(`Deployment restarted — ${run.environment} · ${run.branch} (simulated).`);
  }

  function cancel() {
    const active = snapshot.activeRecordId ? snapshot.records.find((record) => record.id === snapshot.activeRecordId) : undefined;
    if (!active || !isBusyStatus(active.status)) return;
    if (timersRef.current.length > 0) {
      runTokenRef.current += 1;
      clearTimers();
    }
    patchRecord(active.id, { status: "cancelled", endedAt: "Just now", logs: buildDeploymentLogs("cancelled") });
    onNotice?.("Deployment cancelled (simulated).");
  }

  function setConfiguration(partial: Partial<DeploymentConfig>) {
    setSnapshot((prev) => ({ ...prev, config: { ...prev.config, ...partial } }));
  }

  function setEnvironment(environment: DeploymentEnvironment) {
    setSnapshot((prev) => ({ ...prev, config: { ...prev.config, environment } }));
    onNotice?.(`Deployment environment switched to ${environment} (simulated).`);
  }

  function setSimulateFailure(enabled: boolean) {
    setSnapshot((prev) => ({ ...prev, simulateFailure: enabled }));
  }

  function inspect(recordId: string | null) {
    setSnapshot((prev) => ({ ...prev, activeRecordId: recordId }));
  }

  function resetDemo() {
    clearTimers();
    runTokenRef.current += 1;
    clearDeploymentSnapshot();
    setSnapshot({ ...defaultDeploymentSnapshot });
    onNotice?.("Deployment demo state reset.");
  }

  const activeRecord = useMemo(() => {
    if (!snapshot.activeRecordId) return undefined;
    return snapshot.records.find((record) => record.id === snapshot.activeRecordId);
  }, [snapshot.activeRecordId, snapshot.records]);

  const activeStatus = activeRecord?.status ?? "idle";
  const busy = isBusyStatus(activeStatus);

  const latestReady = useMemo(() => {
    const ready = snapshot.records.filter((record) => record.status === "ready");
    const byEnv = (env: DeploymentEnvironment) => ready.find((record) => record.environment === env);
    return { production: byEnv("production"), preview: byEnv("preview") };
  }, [snapshot.records]);

  const live = latestReady.production !== undefined;

  return {
    simulateFailure: snapshot.simulateFailure,
    config: snapshot.config,
    records: snapshot.records,
    activeRecord,
    activeStatus,
    busy,
    live,
    latestReady,
    deploy,
    retry,
    cancel,
    setConfiguration,
    setEnvironment,
    setSimulateFailure,
    inspect,
    resetDemo,
    simulatedNote: deploymentSimulatedNote,
  };
}

export type DeploymentState = ReturnType<typeof useDeploymentState>;