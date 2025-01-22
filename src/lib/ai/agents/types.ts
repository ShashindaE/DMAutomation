export type AgentCapability = 
  | 'CHAT'
  | 'SEARCH'
  | 'CODE'
  | 'WRITE'
  | 'ANALYZE'
  | 'SOCIAL_MEDIA';

export interface TrainingData {
  id: string;
  content: string;
  type: 'EXAMPLE' | 'RULE' | 'KNOWLEDGE';
  category: string;
  tags: string[];
  createdAt: Date;
  updatedAt: Date;
}

export interface AgentConfig {
  id: string;
  name: string;
  description: string | null;
  capabilities: AgentCapability[];
  model: string;
  temperature: number;
  maxTokens: number;
  systemPrompt: string;
  active: boolean;
  metricsPeriod: string;
  workspaceId: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface ConversationTurn {
  id: string;
  role: 'user' | 'assistant' | 'system';
  content: string;
  timestamp: Date;
  metadata?: {
    intent?: string;
    confidence?: number;
    entities?: any[];
    agentId: string;
  };
}

export interface AgentConversation {
  id: string;
  agentId: string;
  userId: string;
  automationId?: string;
  turns: ConversationTurn[];
  status: 'ACTIVE' | 'COMPLETED' | 'FAILED';
  startedAt: Date;
  endedAt?: Date;
  metadata?: {
    context?: any;
    performance?: {
      averageResponseTime: number;
      userSatisfactionScore?: number;
    };
  };
}

export interface AgentPerformanceMetrics {
  id: string;
  agentId: string;
  period: 'DAILY' | 'WEEKLY' | 'MONTHLY';
  metrics: {
    totalConversations: number;
    averageResponseTime: number;
    successRate: number;
    userSatisfactionScore: number;
    commonQueries: Array<{
      query: string;
      count: number;
    }>;
    errorRate: number;
  };
  timestamp: Date;
}

export interface AgentTrainingSession {
  id: string;
  agentId: string;
  status: 'PENDING' | 'IN_PROGRESS' | 'COMPLETED' | 'FAILED';
  trainingData: TrainingData[];
  startedAt: Date;
  completedAt?: Date;
  metrics?: {
    accuracy: number;
    lossValue: number;
    iterations: number;
  };
  error?: string;
}
