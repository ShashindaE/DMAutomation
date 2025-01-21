import { db } from '@/lib/db';
import { auth } from '@/lib/auth';
import { redirect } from 'next/navigation';
import { AgentCard } from '@/components/global/agents/agent-card';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import Link from 'next/link';
import { AgentCapability, AgentConfig } from '@/lib/ai/agents/types';
import { onBoardUser } from '@/actions/user';

export default async function AgentsPage({
  params,
}: {
  params: { workspaceId: string };
}) {
  const user = await auth();
  if (!user) {
    redirect('/auth-callback?origin=dashboard');
  }

  // First try to get the workspace directly
  try {
    const workspace = await db.workspace.findUnique({
      where: {
        id: params.workspaceId,
        userId: user.id,
      },
      include: {
        agents: true,
      },
    });

    if (workspace) {
      // Convert database agents to AgentConfig type
      const agents: AgentConfig[] = workspace.agents.map((agent) => ({
        id: agent.id,
        name: agent.name,
        description: agent.description,
        languages: agent.languages,
        basePersonality: agent.basePersonality || '',
        createdAt: agent.createdAt,
        updatedAt: agent.updatedAt,
      }));

      return (
        <div className="p-6">
          <div className="mb-8">
            <h1 className="text-4xl font-bold">AI Agents</h1>
            <p className="text-muted-foreground mt-2">
              Manage your AI agents and their capabilities
            </p>
          </div>

          <div className="mb-8">
            <Link href={`/dashboard/${params.workspaceId}/agents/new`}>
              <Button>
                <Plus className="w-4 h-4 mr-2" />
                Create New Agent
              </Button>
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {agents.map((agent) => (
              <AgentCard key={agent.id} agent={agent} workspaceId={params.workspaceId} />
            ))}
          </div>
        </div>
      );
    }
  } catch (error) {
    console.error('Error accessing workspace:', error);
  }

  // If we get here, either the workspace wasn't found or there was an error
  // Try to get or create a valid workspace
  const userResult = await onBoardUser();
  if (userResult.status === 200 || userResult.status === 201) {
    redirect(`/dashboard/${userResult.data.workspaceId}`);
  }

  // If all else fails, redirect to the main dashboard
  redirect('/dashboard');
}
