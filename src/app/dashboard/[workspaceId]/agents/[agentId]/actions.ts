'use server';

import { db } from '@/lib/db';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { z } from 'zod';
import { AgentCapability } from '@/lib/ai/agents/types';

const formSchema = z.object({
  name: z.string().min(2).max(50),
  description: z.string().min(10).max(500),
  model: z.string().min(1),
  temperature: z.number().min(0).max(2),
  maxTokens: z.number().min(100).max(4000),
  systemPrompt: z.string().min(10),
  capabilities: z.array(z.string()).refine(
    (capabilities): capabilities is AgentCapability[] => 
      capabilities.every((cap) => 
        ['CUSTOMER_SERVICE', 'CONTENT_CREATION', 'DATA_ANALYSIS', 'SOCIAL_MEDIA', 'SALES', 'TECHNICAL_SUPPORT'].includes(cap)
      ),
    {
      message: "Invalid agent capability"
    }
  ),
});

export async function updateAgentMetricsPeriod(
  agentId: string,
  period: 'DAILY' | 'WEEKLY' | 'MONTHLY'
) {
  await db.agent.update({
    where: { id: agentId },
    data: { metricsPeriod: period },
  });
  
  revalidatePath('/dashboard/[workspaceId]/agents/[agentId]');
}

export async function updateAgentSettings(
  agentId: string,
  workspaceId: string,
  data: z.infer<typeof formSchema>
) {
  const validatedData = formSchema.parse(data);
  
  await db.agent.update({
    where: { id: agentId },
    data: {
      name: validatedData.name,
      description: validatedData.description,
      model: validatedData.model,
      temperature: validatedData.temperature,
      maxTokens: validatedData.maxTokens,
      systemPrompt: validatedData.systemPrompt,
      capabilities: validatedData.capabilities,
    },
  });

  redirect(`/dashboard/${workspaceId}/agents/${agentId}`);
}
