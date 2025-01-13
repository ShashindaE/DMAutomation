import React from 'react';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { AgentConfig } from '@/lib/ai/agents/types';
import { Switch } from '@/components/ui/switch';
import { 
  BarChart2, 
  MessageSquare, 
  Settings, 
  Trash2 
} from 'lucide-react';

interface AgentCardProps {
  agent: AgentConfig;
  onToggleActive: (id: string, active: boolean) => void;
  onEdit: (id: string) => void;
  onDelete: (id: string) => void;
  onViewMetrics: (id: string) => void;
  onViewConversations: (id: string) => void;
}

export function AgentCard({
  agent,
  onToggleActive,
  onEdit,
  onDelete,
  onViewMetrics,
  onViewConversations,
}: AgentCardProps) {
  return (
    <Card className="w-full max-w-md">
      <CardHeader className="space-y-1">
        <div className="flex items-center justify-between">
          <CardTitle className="text-2xl">{agent.name}</CardTitle>
          <Switch
            checked={agent.active}
            onCheckedChange={(checked) => onToggleActive(agent.id, checked)}
          />
        </div>
        <CardDescription>{agent.description}</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex flex-wrap gap-2">
          {agent.capabilities.map((capability) => (
            <Badge key={capability} variant="secondary">
              {capability.replace('_', ' ')}
            </Badge>
          ))}
        </div>
        <div className="space-y-2">
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">Model:</span>
            <span>{agent.model}</span>
          </div>
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">Temperature:</span>
            <span>{agent.temperature}</span>
          </div>
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">Max Tokens:</span>
            <span>{agent.maxTokens}</span>
          </div>
        </div>
      </CardContent>
      <CardFooter className="flex justify-between">
        <div className="flex space-x-2">
          <Button
            variant="outline"
            size="icon"
            onClick={() => onViewMetrics(agent.id)}
          >
            <BarChart2 className="h-4 w-4" />
          </Button>
          <Button
            variant="outline"
            size="icon"
            onClick={() => onViewConversations(agent.id)}
          >
            <MessageSquare className="h-4 w-4" />
          </Button>
          <Button
            variant="outline"
            size="icon"
            onClick={() => onEdit(agent.id)}
          >
            <Settings className="h-4 w-4" />
          </Button>
        </div>
        <Button
          variant="destructive"
          size="icon"
          onClick={() => onDelete(agent.id)}
        >
          <Trash2 className="h-4 w-4" />
        </Button>
      </CardFooter>
    </Card>
  );
}
