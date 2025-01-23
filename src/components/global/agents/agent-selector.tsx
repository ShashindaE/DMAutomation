import React from 'react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { useForm } from 'react-hook-form';
import { Textarea } from '@/components/ui/textarea';
import { AgentConfig } from '@/lib/ai/agents/types';

interface AgentSelectorProps {
  agents: AgentConfig[];
  onAgentSelect: (agentId: string, prompt: string) => void;
  defaultAgentId?: string;
  defaultPrompt?: string;
}

export function AgentSelector({
  agents,
  onAgentSelect,
  defaultAgentId,
  defaultPrompt,
}: AgentSelectorProps) {
  const form = useForm({
    defaultValues: {
      agentId: defaultAgentId || '',
      prompt: defaultPrompt || '',
    },
  });

  const handleSubmit = form.handleSubmit((data) => {
    onAgentSelect(data.agentId, data.prompt);
  });

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <FormField
        control={form.control}
        name="agentId"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Select AI Agent</FormLabel>
            <FormControl>
              <Select
                value={field.value}
                onValueChange={field.onChange}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Choose an AI agent" />
                </SelectTrigger>
                <SelectContent>
                  {agents.map((agent) => (
                    <SelectItem key={agent.id} value={agent.id}>
                      <div className="flex flex-col">
                        <span className="font-medium">{agent.name}</span>
                        <span className="text-xs text-muted-foreground">
                          {agent.capabilities.join(', ')}
                        </span>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </FormControl>
            <FormDescription>
              Choose an AI agent to handle this automation step
            </FormDescription>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="prompt"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Agent Instructions</FormLabel>
            <FormControl>
              <Textarea
                placeholder="Enter instructions for the AI agent..."
                {...field}
              />
            </FormControl>
            <FormDescription>
              Provide specific instructions for the AI agent to follow
            </FormDescription>
            <FormMessage />
          </FormItem>
        )}
      />
    </form>
  );
}
