import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { AgentConfig } from '@/lib/ai/agents/types';

interface UseAgentProps {
  workspaceId: string;
}

export function useAgent({ workspaceId }: UseAgentProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const createAgent = async (data: Omit<AgentConfig, 'id' | 'createdAt' | 'updatedAt'>) => {
    try {
      setLoading(true);
      const response = await fetch(`/api/workspaces/${workspaceId}/agents`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        throw new Error('Failed to create agent');
      }

      const agent = await response.json();
      toast.success('Agent created successfully');
      router.refresh();
      return agent;
    } catch (error) {
      toast.error('Error creating agent');
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const updateAgent = async (agentId: string, data: Partial<AgentConfig>) => {
    try {
      setLoading(true);
      const response = await fetch(
        `/api/workspaces/${workspaceId}/agents/${agentId}`,
        {
          method: 'PATCH',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(data),
        }
      );

      if (!response.ok) {
        throw new Error('Failed to update agent');
      }

      const agent = await response.json();
      toast.success('Agent updated successfully');
      router.refresh();
      return agent;
    } catch (error) {
      toast.error('Error updating agent');
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const deleteAgent = async (agentId: string) => {
    try {
      setLoading(true);
      const response = await fetch(
        `/api/workspaces/${workspaceId}/agents/${agentId}`,
        {
          method: 'DELETE',
        }
      );

      if (!response.ok) {
        throw new Error('Failed to delete agent');
      }

      toast.success('Agent deleted successfully');
      router.refresh();
    } catch (error) {
      toast.error('Error deleting agent');
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const toggleAgentActive = async (agentId: string, active: boolean) => {
    return updateAgent(agentId, { active });
  };

  return {
    loading,
    createAgent,
    updateAgent,
    deleteAgent,
    toggleAgentActive,
  };
}
