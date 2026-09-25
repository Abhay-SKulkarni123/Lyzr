"use client";

import { Boxes, Braces, GitFork, KeyRound, TerminalSquare } from "lucide-react";
import { deploymentFrameworks, type DeploymentConfig } from "@/data/deployment";

type DeploymentConfigProps = {
  config: DeploymentConfig;
  onConfigChange: (partial: Partial<DeploymentConfig>) => void;
};

const configuredVariables = [
  { key: "OPENAI_API_KEY", label: "Configured" },
  { key: "DATABASE_URL", label: "Configured" },
];

export function DeploymentConfig({ config, onConfigChange }: DeploymentConfigProps) {
  return (
    <div className="space-y-3">
      <div className="grid gap-3">
        <label className="block">
          <span className="mb-1 flex items-center gap-1.5 text-[9px] font-semibold uppercase tracking-wide text-slate-500">
            <Boxes aria-hidden="true" className="h-3 w-3" />
            Framework
          </span>
          <select
            aria-label="Framework"
            className="w-full rounded-md border border-white/[0.1] bg-[#0b0f19] px-2 py-1.5 text-[10px] text-slate-200 outline-none focus:border-coral/40"
            value={config.framework}
            onChange={(event) => {
              const framework = deploymentFrameworks.find((item) => item.label === event.target.value);
              onConfigChange({
                framework: event.target.value,
                buildCommand: framework?.buildCommand ?? config.buildCommand,
                outputDirectory: framework?.outputDirectory ?? config.outputDirectory,
              });
            }}
          >
            {deploymentFrameworks.map((framework) => (
              <option key={framework.id} value={framework.label}>
                {framework.label}
              </option>
            ))}
          </select>
        </label>

        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          <label className="block">
            <span className="mb-1 flex items-center gap-1.5 text-[9px] font-semibold uppercase tracking-wide text-slate-500">
              <TerminalSquare aria-hidden="true" className="h-3 w-3" />
              Build command
            </span>
            <input
              className="w-full rounded-md border border-white/[0.1] bg-[#0b0f19] px-2 py-1.5 font-mono text-[10px] text-slate-200 outline-none focus:border-coral/40"
              value={config.buildCommand}
              onChange={(event) => onConfigChange({ buildCommand: event.target.value })}
            />
          </label>
          <label className="block">
            <span className="mb-1 flex items-center gap-1.5 text-[9px] font-semibold uppercase tracking-wide text-slate-500">
              <Braces aria-hidden="true" className="h-3 w-3" />
              Output directory
            </span>
            <input
              className="w-full rounded-md border border-white/[0.1] bg-[#0b0f19] px-2 py-1.5 font-mono text-[10px] text-slate-200 outline-none focus:border-coral/40"
              value={config.outputDirectory}
              onChange={(event) => onConfigChange({ outputDirectory: event.target.value })}
            />
          </label>
        </div>
      </div>

      <label className="flex cursor-pointer items-start gap-2 rounded-md border border-white/[0.06] bg-white/[0.02] p-3">
        <input
          aria-describedby="auto-deploy-hint"
          className="mt-0.5 h-3 w-3 accent-coral"
          checked={config.autoDeployFromGithub}
          onChange={(event) => onConfigChange({ autoDeployFromGithub: event.target.checked })}
          type="checkbox"
        />
        <span>
          <span className="flex items-center gap-1.5 text-[10px] font-medium text-slate-300">
            <GitFork aria-hidden="true" className="h-3 w-3" />
            Auto deploy from GitHub
          </span>
          <span className="mt-0.5 block text-[8px] leading-4 text-slate-600" id="auto-deploy-hint">
            Deploys when matching pushes land on the production branch. Simulated. No events are received.
          </span>
        </span>
      </label>

      <div className="rounded-md border border-white/[0.06] bg-white/[0.02] p-3">
        <p className="mb-2 flex items-center gap-1.5 text-[9px] font-semibold uppercase tracking-wide text-slate-500">
          <KeyRound aria-hidden="true" className="h-3 w-3" />
          Environment variables
        </p>
        <ul className="space-y-1.5">
          {configuredVariables.map((variable) => (
            <li key={variable.key} className="flex items-center gap-2 font-mono text-[10px]">
              <span className="text-slate-400">{variable.key}</span>
              <span className="tracking-widest text-slate-600">••••••••••</span>
              <span className="ml-auto text-emerald-300">{variable.label}</span>
            </li>
          ))}
        </ul>
        <p className="mt-2 text-[8px] leading-4 text-slate-600">
          Values are simulated and never stored. Real secrets would live in the deployment provider, never in the browser.
        </p>
      </div>
    </div>
  );
}