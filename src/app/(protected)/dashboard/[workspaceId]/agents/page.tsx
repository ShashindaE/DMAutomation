import { db } from '@/lib/db';
import { redirect } from 'next/navigation';
import { AgentCapability, AgentConfig } from '@/lib/ai/agents/types';
import { AgentsList } from './_components/agents-list';
import { currentUser } from '@clerk/nextjs/server';

interface Agent {
  id: string;
  name: string;
  description: string;
  capabilities: string[];
  model: string;
  temperature: number;
  maxTokens: number;
  systemPrompt: string;
  active: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export default async function AgentsPage({
  params,
}: {
  params: { workspaceId: string };
}) {
  const user = await currentUser();
  if (!user) {
    redirect('/auth-callback?origin=dashboard');
  }

  // First find the user's workspaces
  const dbUser = await db.user.findUnique({
    where: {
      clerkId: user.id
    },
    include: {
      workspaces: true
    }
  });

  if (!dbUser) {
    console.log("No user found in database");
    redirect('/dashboard');
  }

  console.log("Looking for workspace:", params.workspaceId);
  console.log("Available workspaces:", dbUser.workspaces.map(w => ({ id: w.id, name: w.name })));

  // Find the workspace by ID
  const workspace = dbUser.workspaces.find(w => w.id === params.workspaceId);

  if (!workspace) {
    console.log("No matching workspace found");
    redirect('/dashboard');
  }

  console.log("Found workspace:", workspace.id);

  // Now get the agents for this workspace
  const workspaceWithAgents = await db.workspace.findUnique({
    where: {
      id: workspace.id
    },
    include: {
      agents: true
    }
  });

  if (!workspaceWithAgents) {
    console.log("Could not fetch workspace with agents");
    redirect('/dashboard');
  }

  // Convert database agents to AgentConfig type
  const agents: AgentConfig[] = (workspaceWithAgents.agents as Agent[])?.map(agent => ({
    id: agent.id,
    name: agent.name,
    description: agent.description,
    capabilities: agent.capabilities as AgentCapability[],
    model: agent.model,
    temperature: agent.temperature,
    maxTokens: agent.maxTokens,
    systemPrompt: agent.systemPrompt,
    active: agent.active,
    createdAt: agent.createdAt,
    updatedAt: agent.updatedAt,
  })) || [];

  return <AgentsList agents={agents} workspaceId={workspace.id} />;
}
