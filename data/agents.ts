export type AgentFrameworkId = "langgraph" | "crewai" | "openai-agents" | "v0" | "custom";

export type AgentFramework = {
  id: AgentFrameworkId;
  label: string;
  description: string;
};

export const agentFrameworks: AgentFramework[] = [
  { id: "langgraph", label: "LangGraph", description: "Stateful graphs for agent workflows" },
  { id: "crewai", label: "CrewAI", description: "Role-based multi-agent teams" },
  { id: "openai-agents", label: "OpenAI Agents SDK", description: "Handle-based agent orchestration" },
  { id: "v0", label: "Vercel v0", description: "Prompt-to-UI generation" },
  { id: "custom", label: "Custom runtime", description: "Bring-your-own orchestration" },
];

export const agentModels = ["GPT-4o", "Claude Sonnet 4", "Llama 3.3 70B", "Gemini 2.5"];

export const agentTools = [
  "Read files",
  "Edit files",
  "Run commands",
  "Browse the web",
  "Call your APIs",
  "Deploy previews",
];

export type CustomAgentDefinition = {
  id: string;
  name: string;
  role: string;
  frameworkId: AgentFrameworkId;
  model: string;
  tools: string[];
  instructions: string;
};