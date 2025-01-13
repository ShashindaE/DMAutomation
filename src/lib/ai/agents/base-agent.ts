import { openai } from '../../openai';
import {
  AgentConfig,
  AgentConversation,
  ConversationTurn,
  TrainingData
} from './types';

export abstract class BaseAgent {
  protected config: AgentConfig;
  protected trainingData: TrainingData[];
  protected currentConversation: AgentConversation | null = null;

  constructor(config: AgentConfig, trainingData: TrainingData[] = []) {
    this.config = config;
    this.trainingData = trainingData;
  }

  public abstract validateCapability(query: string): Promise<boolean>;

  protected async generateResponse(
    query: string,
    conversationHistory: ConversationTurn[] = []
  ): Promise<string> {
    try {
      const systemMessage = this.buildSystemMessage();
      const contextMessages = this.buildContextMessages();
      const conversationMessages = this.formatConversationHistory(conversationHistory);

      const response = await openai.chat.completions.create({
        model: this.config.model,
        messages: [
          { role: 'system', content: systemMessage },
          ...contextMessages,
          ...conversationMessages,
          { role: 'user', content: query }
        ],
        temperature: this.config.temperature,
        max_tokens: this.config.maxTokens
      });

      return response.choices[0]?.message?.content || 'I apologize, but I couldn\'t generate a response.';
    } catch (error) {
      console.error('Error generating response:', error);
      throw new Error('Failed to generate response');
    }
  }

  protected buildSystemMessage(): string {
    const capabilities = this.config.capabilities.join(', ');
    return `${this.config.systemPrompt}\n\nThis agent specializes in: ${capabilities}`;
  }

  protected buildContextMessages(): { role: 'system', content: string }[] {
    const relevantTrainingData = this.trainingData
      .filter(data => data.type === 'KNOWLEDGE')
      .map(data => data.content)
      .join('\n\n');

    return relevantTrainingData ? [
      { role: 'system', content: `Additional context:\n${relevantTrainingData}` }
    ] : [];
  }

  protected formatConversationHistory(
    history: ConversationTurn[]
  ): { role: 'user' | 'assistant' | 'system', content: string }[] {
    return history.map(turn => ({
      role: turn.role,
      content: turn.content
    }));
  }

  public async startConversation(userId: string, automationId?: string): Promise<string> {
    this.currentConversation = {
      id: crypto.randomUUID(),
      agentId: this.config.id,
      userId,
      automationId,
      turns: [],
      status: 'ACTIVE',
      startedAt: new Date(),
      metadata: {
        context: {},
        performance: {
          averageResponseTime: 0
        }
      }
    };
    return this.currentConversation.id;
  }

  public async processMessage(query: string): Promise<ConversationTurn> {
    if (!this.currentConversation) {
      throw new Error('No active conversation');
    }

    const startTime = Date.now();

    try {
      // Add user message to conversation
      const userTurn: ConversationTurn = {
        id: crypto.randomUUID(),
        role: 'user',
        content: query,
        timestamp: new Date()
      };
      this.currentConversation.turns.push(userTurn);

      // Generate and add agent response
      const response = await this.generateResponse(
        query,
        this.currentConversation.turns
      );

      const agentTurn: ConversationTurn = {
        id: crypto.randomUUID(),
        role: 'assistant',
        content: response,
        timestamp: new Date(),
        metadata: {
          agentId: this.config.id
        }
      };
      this.currentConversation.turns.push(agentTurn);

      // Update performance metrics
      const responseTime = Date.now() - startTime;
      if (this.currentConversation.metadata?.performance) {
        const currentAvg = this.currentConversation.metadata.performance.averageResponseTime;
        const turnCount = this.currentConversation.turns.filter(t => t.role === 'assistant').length;
        this.currentConversation.metadata.performance.averageResponseTime =
          (currentAvg * (turnCount - 1) + responseTime) / turnCount;
      }

      return agentTurn;
    } catch (error) {
      console.error('Error processing message:', error);
      this.currentConversation.status = 'FAILED';
      throw error;
    }
  }

  public endConversation(): AgentConversation {
    if (!this.currentConversation) {
      throw new Error('No active conversation');
    }

    this.currentConversation.status = 'COMPLETED';
    this.currentConversation.endedAt = new Date();
    const conversation = { ...this.currentConversation };
    this.currentConversation = null;
    return conversation;
  }

  public getConfig(): AgentConfig {
    return this.config;
  }

  public updateConfig(newConfig: Partial<AgentConfig>): void {
    this.config = {
      ...this.config,
      ...newConfig,
      updatedAt: new Date()
    };
  }

  public addTrainingData(data: TrainingData): void {
    this.trainingData.push(data);
  }

  public removeTrainingData(id: string): void {
    this.trainingData = this.trainingData.filter(data => data.id !== id);
  }
}
