import { auth } from '@/lib/auth';
import { redirect } from 'next/navigation';
import AgentFormWrapper from '@/components/global/agents/agent-form-wrapper';

export default async function NewAgentPage({
  params,
}: {
  params: { workspaceId: string };
}) {
  const user = await auth();
  if (!user) {
    redirect('/auth-callback?origin=dashboard');
  }

  return (
    <div className="p-6">
      <div className="mb-8">
        <h1 className="text-4xl font-bold">Create New Agent</h1>
        <p className="text-muted-foreground mt-2">
          Configure your new AI agent&apos;s capabilities and behavior
        </p>
      </div>

      <div className="max-w-2xl">
        <AgentFormWrapper />
      </div>
    </div>
  );
}
