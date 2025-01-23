import { db } from '@/lib/db';
import { auth } from '@/lib/auth';
import { redirect } from 'next/navigation';
import { AgentCard } from '@/components/global/agents/agent-card';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import Link from 'next/link';
import { AgentCapability, AgentConfig } from '@/lib/ai/agents/types';

export default async function AgentsPage({
  params,
}: {
  params: { workspaceId: string };
}) {
  const user = await auth();
  if (!user) {
    redirect('/auth-callback?origin=dashboard');
  }

  const workspace = await db.workspace.findUnique({
    where: {
      id: params.workspaceId,
      userId: user.id,
    },
    include: {
      agents: true,
    },
  });

  if (!workspace) {
    redirect('/dashboard');
  }

  // Convert database agents to AgentConfig type
  const agents: AgentConfig[] = workspace.agents.map(agent => ({
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
  }));

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-4xl font-bold">AI Agents</h1>
          <p className="text-muted-foreground mt-2">
            Manage your AI agents and their capabilities
          </p>
        </div>
        <Button asChild>
          <Link href={`/dashboard/${params.workspaceId}/agents/new`}>
            <Plus className="h-4 w-4 mr-2" />
            New Agent
          </Link>
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {agents.map((agent) => (
          <AgentCard
            key={agent.id}
            agent={agent}
            onToggleActive={(id, active) => {}}
            onEdit={(id) =>
              redirect(`/dashboard/${params.workspaceId}/agents/${id}`)
            }
            onDelete={(id) => {}}
            onViewMetrics={(id) =>
              redirect(`/dashboard/${params.workspaceId}/agents/${id}/metrics`)
            }
            onViewConversations={(id) =>
              redirect(
                `/dashboard/${params.workspaceId}/agents/${id}/conversations`
              )
            }
          />
        ))}
      </div>

      {agents.length === 0 && (
        <div className="text-center mt-10">
          <h3 className="text-lg font-semibold">No agents found</h3>
          <p className="text-muted-foreground mt-2">
            Create your first AI agent to get started
          </p>
          <Button asChild className="mt-4">
            <Link href={`/dashboard/${params.workspaceId}/agents/new`}>
              <Plus className="h-4 w-4 mr-2" />
              Create Agent
            </Link>
          </Button>
        </div>
      )}
    </div>
  );
}
