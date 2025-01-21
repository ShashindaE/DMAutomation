import { openai } from '../openai';
import { contextManager } from './context-manager';
import { Entity, Message } from './types';

interface AIContext {
  userPreferences?: {
    language?: string
    expertise?: 'beginner' | 'intermediate' | 'expert'
  }
  conversationHistory?: Message[]
}

interface AIResponse {
  content: string
  type: 'success' | 'error'
  followUpQuestions?: string[]
}

export class EnhancedAI {
  private static instance: EnhancedAI;
  private readonly commonPatterns: Array<[RegExp, string]>;
  private context: AIContext;

  private constructor() {
    // Initialize common patterns for quick responses
    this.commonPatterns = [
      [/^hi|hello|hey$/i, 'greeting'],
      [/how (are|r) (you|u)/i, 'greeting'],
      [/help|support/i, 'help'],
      [/thank(s| you)/i, 'gratitude']
    ];
    this.context = {};
  }

  public static getInstance(): EnhancedAI {
    if (!EnhancedAI.instance) {
      EnhancedAI.instance = new EnhancedAI();
    }
    return EnhancedAI.instance;
  }

  public async processMessage(
    userId: string,
    sessionId: string,
    message: string
  ): Promise<AIResponse> {
    try {
      // Get conversation context
      const context = contextManager.getContext(userId, sessionId);
      this.context = context;

      // Check for common patterns first
      const quickResponse = this.checkCommonPatterns(message);
      if (quickResponse) {
        return {
          content: quickResponse,
          type: 'success'
        };
      }

      // Prepare conversation history
      const history = this.prepareConversationHistory(context.previousMessages);

      // Generate system prompt
      const systemPrompt = this.generateSystemPrompt(this.context);

      // Process message with AI model
      const response = await this.callAIModel(message, history, systemPrompt);

      // Generate follow-up questions
      const followUpQuestions = this.generateFollowUpQuestions(response);

      // Extract and process the response
      const entities = await this.extractEntities(message);
      const intent = await this.detectIntent(message, entities);

      // Update context with the new message
      contextManager.updateContext(userId, sessionId, {
        role: 'user',
        content: message,
        timestamp: new Date(),
        metadata: { intent, entities }
      });

      return {
        content: response,
        type: 'success',
        followUpQuestions
      };

    } catch (error) {
      console.error('Error processing message:', error);
      return {
        content: 'I apologize, but I encountered an error processing your request. Please try again.',
        type: 'error'
      };
    }
  }

  private async extractEntities(message: string): Promise<Entity[]> {
    // Use OpenAI to extract entities
    const response = await openai.chat.completions.create({
      model: 'gpt-4-turbo-preview',
      messages: [
        {
          role: 'system',
          content: 'Extract named entities from the following text and return them as JSON array with type, value, and confidence.'
        },
        { role: 'user', content: message }
      ],
      temperature: 0,
      response_format: { type: 'json_object' }
    });

    try {
      const result = JSON.parse(response.choices[0]?.message?.content || '[]');
      return result.entities || [];
    } catch {
      return [];
    }
  }

  private async detectIntent(message: string, entities: Entity[]): Promise<string> {
    // Use OpenAI to detect intent
    const response = await openai.chat.completions.create({
      model: 'gpt-4-turbo-preview',
      messages: [
        {
          role: 'system',
          content: 'Detect the primary intent of the following message. Return a single word or short phrase.'
        },
        {
          role: 'user',
          content: `Message: ${message}\nExtracted Entities: ${JSON.stringify(entities)}`
        }
      ],
      temperature: 0,
      max_tokens: 50
    });

    return response.choices[0]?.message?.content?.toLowerCase() || 'unknown';
  }

  private generateSystemPrompt(context: AIContext): string {
    const { userPreferences } = context;
    let prompt = 'You are a helpful AI assistant.';

    if (userPreferences?.language) {
      prompt += ` Please respond in ${userPreferences.language}.`;
    }

    if (userPreferences?.expertise) {
      prompt += ` Adjust explanations for ${userPreferences.expertise} level understanding.`;
    }

    return prompt;
  }

  private prepareConversationHistory(messages: Message[]): Message[] {
    // Keep only the last 10 messages to maintain context without overloading
    return messages.slice(-10);
  }

  private checkCommonPatterns(message: string): string | null {
    for (const [pattern, intent] of this.commonPatterns) {
      if (pattern.test(message)) {
        return this.getQuickResponse(intent);
      }
    }
    return null;
  }

  private getQuickResponse(intent: string): string {
    const responses: { [key: string]: string[] } = {
      greeting: ['Hello! How can I help you today?', 'Hi there! What can I do for you?'],
      help: ['I\'m here to help! What do you need assistance with?'],
      gratitude: ['You\'re welcome!', 'Happy to help!']
    };

    const options = responses[intent] || ['I\'m here to help!'];
    return options[Math.floor(Math.random() * options.length)];
  }

  private async callAIModel(
    message: string,
    history: Message[],
    systemPrompt: string
  ): Promise<string> {
    // Get response from OpenAI with enhanced context
    const completion = await openai.chat.completions.create({
      model: 'gpt-4-turbo-preview',
      messages: [
        {
          role: 'system',
          content: systemPrompt
        },
        ...history,
        { role: 'user', content: message }
      ],
      temperature: 0.7,
      max_tokens: 500,
      presence_penalty: 0.6,
      frequency_penalty: 0.5
    });

    // Extract and process the response
    return completion.choices[0]?.message?.content || '';
  }

  private generateFollowUpQuestions(response: string): string[] {
    const questions: string[] = [];

    // Add contextual follow-up questions
    if (response.length > 100) {
      questions.push('Would you like me to explain anything in more detail?');
    }

    return questions;
  }
}

export const enhancedAI = EnhancedAI.getInstance();
