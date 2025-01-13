import { ConversationContext, Message, UserPreferences } from './types';

class ContextManager {
  private contexts: Map<string, ConversationContext> = new Map();
  private readonly MAX_CONTEXT_AGE = 30 * 60 * 1000; // 30 minutes
  private readonly MAX_MESSAGES = 10;

  constructor() {
    // Periodically clean up old contexts
    setInterval(() => this.cleanupOldContexts(), 5 * 60 * 1000);
  }

  public getContext(userId: string, sessionId: string): ConversationContext {
    const key = this.getContextKey(userId, sessionId);
    let context = this.contexts.get(key);

    if (!context) {
      context = this.createNewContext(userId, sessionId);
      this.contexts.set(key, context);
    }

    return context;
  }

  public updateContext(
    userId: string,
    sessionId: string,
    message: Message,
    userPreferences?: UserPreferences
  ): void {
    const context = this.getContext(userId, sessionId);
    
    // Add new message while maintaining message limit
    context.previousMessages = [
      ...context.previousMessages.slice(-(this.MAX_MESSAGES - 1)),
      message
    ];
    
    // Update preferences if provided
    if (userPreferences) {
      context.userPreferences = {
        ...context.userPreferences,
        ...userPreferences
      };
    }

    context.lastInteractionTime = new Date();
    this.contexts.set(this.getContextKey(userId, sessionId), context);
  }

  private createNewContext(userId: string, sessionId: string): ConversationContext {
    return {
      userId,
      sessionId,
      previousMessages: [],
      lastInteractionTime: new Date(),
      userPreferences: {
        language: 'en',
        timezone: 'UTC',
        responseStyle: 'concise'
      }
    };
  }

  private cleanupOldContexts(): void {
    const now = new Date().getTime();
    const keysToDelete: string[] = [];

    // First collect keys to delete
    this.contexts.forEach((context, key) => {
      if (now - context.lastInteractionTime.getTime() > this.MAX_CONTEXT_AGE) {
        keysToDelete.push(key);
      }
    });

    // Then delete them
    keysToDelete.forEach(key => this.contexts.delete(key));
  }

  private getContextKey(userId: string, sessionId: string): string {
    return `${userId}:${sessionId}`;
  }
}

export const contextManager = new ContextManager();
