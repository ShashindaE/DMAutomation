'use client';

import { AgentCard } from '@/components/global/agents/agent-card';
import { Button } from '@/components/ui/button';
import { AgentConfig } from '@/lib/ai/agents/types';
import { Plus } from 'lucide-react';
import Link from 'next/link';
import { useCallback } from 'react';
import { toast } from 'sonner';
import { toggleAgentActive, deleteAgent } from '../actions';

interface AgentsListProps {
  agents: AgentConfig[];
  workspaceId: string;
}

export function AgentsList({ agents = [], workspaceId }: AgentsListProps) {
  const handleToggleActive = useCallback(async (id: string, active: boolean) => {
    try {
      const formData = new FormData();
      formData.append('agentId', id);
      formData.append('active', active.toString());

      const result = await toggleAgentActive(formData);
      if (result.success) {
        toast.success(`Agent ${active ? 'activated' : 'deactivated'}`);
      } else {
        throw new Error(result.error);
      }
    } catch (error) {
      toast.error('Failed to update agent status');
    }
  }, []);

  const handleEdit = useCallback((id: string) => {
    window.location.href = `/dashboard/${workspaceId}/agents/${id}/edit`;
  }, [workspaceId]);

  const handleDelete = useCallback(async (id: string) => {
    try {
      const formData = new FormData();
      formData.append('agentId', id);

      const result = await deleteAgent(formData);
      if (result.success) {
        toast.success('Agent deleted');
      } else {
        throw new Error(result.error);
      }
    } catch (error) {
      toast.error('Failed to delete agent');
    }
  }, []);

  const handleViewMetrics = useCallback((id: string) => {
    window.location.href = `/dashboard/${workspaceId}/agents/${id}/metrics`;
  }, [workspaceId]);

  const handleViewConversations = useCallback((id: string) => {
    window.location.href = `/dashboard/${workspaceId}/agents/${id}/conversations`;
  }, [workspaceId]);

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-2xl font-bold">AI Agents</h1>
        <Link href={`/dashboard/${workspaceId}/agents/new`}>
          <Button className="flex gap-x-2">
            <Plus className="h-4 w-4" />
            Create Agent
          </Button>
        </Link>
      </div>

      {!agents || agents.length === 0 ? (
        <div className="flex flex-col items-center justify-center h-[60vh]">
          <p className="text-muted-foreground mb-4">No Agents Created</p>
          <Link href={`/dashboard/${workspaceId}/agents/new`}>
            <Button className="flex gap-x-2">
              <Plus className="h-4 w-4" />
              Create Agent
            </Button>
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {agents.map((agent) => (
            <AgentCard
              key={agent.id}
              agent={agent}
              onToggleActive={handleToggleActive}
              onEdit={handleEdit}
              onDelete={handleDelete}
              onViewMetrics={handleViewMetrics}
              onViewConversations={handleViewConversations}
            />
          ))}
        </div>
      )}
    </div>
  );
}
