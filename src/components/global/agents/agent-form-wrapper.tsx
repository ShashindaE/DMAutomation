'use client';

import { AgentForm } from './agent-form';
import { useParams } from 'next/navigation';

export default function AgentFormWrapper() {
  const params = useParams();
  const workspaceId = params.workspaceId as string;

  return (
    <AgentForm
      onSubmit={async (data) => {
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

        window.location.href = `/dashboard/${workspaceId}/agents`;
      }}
      onCancel={() => {
        window.location.href = `/dashboard/${workspaceId}/agents`;
      }}
    />
  );
}
