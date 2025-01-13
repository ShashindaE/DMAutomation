'use client';

import React from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import * as z from 'zod';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Slider } from '@/components/ui/slider';
import { AgentCapability, AgentConfig } from '@/lib/ai/agents/types';
import { Badge } from '@/components/ui/badge';
import { X } from 'lucide-react';

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

interface AgentFormProps {
  initialData?: Partial<AgentConfig>;
  onSubmit: (data: z.infer<typeof formSchema>) => void;
  onCancel: () => void;
}

const availableModels = [
  'gpt-4-turbo-preview',
  'gpt-4',
  'gpt-3.5-turbo',
] as const;

const availableCapabilities: AgentCapability[] = [
  'CUSTOMER_SERVICE',
  'CONTENT_CREATION',
  'DATA_ANALYSIS',
  'SOCIAL_MEDIA',
  'SALES',
  'TECHNICAL_SUPPORT',
];

export function AgentForm({ initialData, onSubmit, onCancel }: AgentFormProps) {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: initialData?.name || '',
      description: initialData?.description || '',
      model: initialData?.model || 'gpt-4-turbo-preview',
      temperature: initialData?.temperature || 0.7,
      maxTokens: initialData?.maxTokens || 2000,
      systemPrompt: initialData?.systemPrompt || '',
      capabilities: (initialData?.capabilities || []) as AgentCapability[],
    },
  });

  const addCapability = (capability: AgentCapability) => {
    const currentCapabilities = form.getValues('capabilities') as AgentCapability[];
    if (!currentCapabilities.includes(capability)) {
      form.setValue('capabilities', [...currentCapabilities, capability]);
    }
  };

  const removeCapability = (capability: AgentCapability) => {
    const currentCapabilities = form.getValues('capabilities') as AgentCapability[];
    form.setValue(
      'capabilities',
      currentCapabilities.filter((c) => c !== capability)
    );
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Name</FormLabel>
              <FormControl>
                <Input placeholder="Customer Support Agent" {...field} />
              </FormControl>
              <FormDescription>
                A descriptive name for your AI agent
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Description</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="This agent handles customer support inquiries..."
                  {...field}
                />
              </FormControl>
              <FormDescription>
                A detailed description of what this agent does
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="model"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Model</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a model" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {availableModels.map((model) => (
                    <SelectItem key={model} value={model}>
                      {model}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormDescription>
                The AI model to use for this agent
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="temperature"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Temperature: {field.value}</FormLabel>
              <FormControl>
                <Slider
                  min={0}
                  max={2}
                  step={0.1}
                  value={[field.value]}
                  onValueChange={(values) => field.onChange(values[0])}
                />
              </FormControl>
              <FormDescription>
                Controls randomness in responses (0 = deterministic, 2 = very random)
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="maxTokens"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Max Tokens</FormLabel>
              <FormControl>
                <Input
                  type="number"
                  min={100}
                  max={4000}
                  {...field}
                  onChange={(e) => field.onChange(Number(e.target.value))}
                />
              </FormControl>
              <FormDescription>
                Maximum length of generated responses (100-4000)
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="systemPrompt"
          render={({ field }) => (
            <FormItem>
              <FormLabel>System Prompt</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="You are a helpful customer support agent..."
                  className="min-h-[100px]"
                  {...field}
                />
              </FormControl>
              <FormDescription>
                The system prompt that defines the agent's behavior
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="capabilities"
          render={() => (
            <FormItem>
              <FormLabel>Capabilities</FormLabel>
              <FormControl>
                <div className="space-y-4">
                  <div className="flex flex-wrap gap-2">
                    {form.getValues('capabilities').map((capability) => (
                      <Badge
                        key={capability}
                        variant="secondary"
                        className="flex items-center gap-1"
                      >
                        {capability}
                        <button
                          type="button"
                          onClick={() => removeCapability(capability as AgentCapability)}
                          className="ml-1 hover:bg-destructive/20 rounded-full"
                        >
                          <X className="h-3 w-3" />
                        </button>
                      </Badge>
                    ))}
                  </div>
                  <Select
                    onValueChange={(value: AgentCapability) => addCapability(value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Add capability" />
                    </SelectTrigger>
                    <SelectContent>
                      {availableCapabilities
                        .filter(
                          (cap) => !form.getValues('capabilities').includes(cap)
                        )
                        .map((capability) => (
                          <SelectItem key={capability} value={capability}>
                            {capability}
                          </SelectItem>
                        ))}
                    </SelectContent>
                  </Select>
                </div>
              </FormControl>
              <FormDescription>
                Select the capabilities this agent should have
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="flex justify-end gap-4">
          <Button
            type="button"
            variant="outline"
            onClick={onCancel}
          >
            Cancel
          </Button>
          <Button type="submit">
            {initialData ? 'Update Agent' : 'Create Agent'}
          </Button>
        </div>
      </form>
    </Form>
  );
}
