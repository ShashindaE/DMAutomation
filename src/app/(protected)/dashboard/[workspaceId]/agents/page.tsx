import { db } from '@/lib/db';
import { redirect } from 'next/navigation';
import { AgentConfig, AgentCapability } from '@/lib/ai/agents/types';
import { AgentsList } from './_components/agents-list';
import { currentUser } from '@clerk/nextjs/server';
import { Prisma } from '@prisma/client';

type AgentWithoutRelations = Prisma.AgentGetPayload<{}>;

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

  const workspace = dbUser.workspaces.find(w => w.id === params.workspaceId);

  if (!workspace) {
    console.log("No matching workspace found");
    redirect('/dashboard');
  }

  console.log("Found workspace:", workspace.id);

  // Get agents with proper Prisma type
  const agents = await db.agent.findMany({
    where: {
      workspaceId: params.workspaceId
    },
    select: {
      id: true,
      name: true,
      description: true,
      capabilities: true,
      model: true,
      temperature: true,
      maxTokens: true,
      systemPrompt: true,
      active: true,
      metricsPeriod: true,
      workspaceId: true,
      createdAt: true,
      updatedAt: true
    }
  });

  // Map the agents to AgentConfig type
  const agentConfigs: AgentConfig[] = agents.map(agent => ({
    id: agent.id,
    name: agent.name,
    description: agent.description,
    capabilities: agent.capabilities as AgentCapability[],
    model: agent.model,
    temperature: agent.temperature,
    maxTokens: agent.maxTokens,
    systemPrompt: agent.systemPrompt,
    active: agent.active,
    metricsPeriod: agent.metricsPeriod,
    workspaceId: agent.workspaceId,
    createdAt: agent.createdAt,
    updatedAt: agent.updatedAt
  }));

  return (
    <div className="flex flex-col gap-4 p-4">
      <AgentsList agents={agentConfigs} workspaceId={params.workspaceId} />
    </div>
  );
}
