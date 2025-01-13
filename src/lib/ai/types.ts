export interface ConversationContext {
  userId: string;
  sessionId: string;
  previousMessages: Message[];
  userPreferences?: UserPreferences;
  lastInteractionTime: Date;
}

export interface Message {
  role: 'system' | 'user' | 'assistant';
  content: string;
  timestamp: Date;
  metadata?: {
    intent?: string;
    entities?: Entity[];
    confidence?: number;
  };
}

export interface Entity {
  type: string;
  value: string;
  confidence: number;
}

export interface UserPreferences {
  language: string;
  timezone: string;
  topics?: string[];
  responseStyle?: 'concise' | 'detailed';
}

export interface AIResponse {
  text: string;
  confidence: number;
  context: {
    intent: string;
    entities: Entity[];
    followUpQuestions?: string[];
  };
}
