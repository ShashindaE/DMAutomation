import { openai } from '../openai';
import { contextManager } from './context-manager';
import { AIResponse, Entity, Message } from './types';

export class EnhancedAI {
  private static instance: EnhancedAI;
  private readonly commonPatterns: Array<[RegExp, string]>;

  private constructor() {
    // Initialize common patterns for quick responses
    this.commonPatterns = [
      [/^hi|hello|hey$/i, 'greeting'],
      [/how (are|r) (you|u)/i, 'greeting'],
      [/help|support/i, 'help'],
      [/thank(s| you)/i, 'gratitude']
    ];
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
    // Get conversation context
    const context = contextManager.getContext(userId, sessionId);

    // Check for common patterns first
    const quickResponse = this.checkCommonPatterns(message);
    if (quickResponse) {
      return this.createResponse(quickResponse, 1.0, 'pattern_match');
    }

    // Prepare conversation history for better context
    const conversationHistory = this.prepareConversationHistory(context.previousMessages);

    try {
      // Get response from OpenAI with enhanced context
      const completion = await openai.chat.completions.create({
        model: 'gpt-4-turbo-preview',
        messages: [
          {
            role: 'system',
            content: this.generateSystemPrompt(context)
          },
          ...conversationHistory,
          { role: 'user', content: message }
        ],
        temperature: 0.7,
        max_tokens: 500,
        presence_penalty: 0.6,
        frequency_penalty: 0.5
      });

      // Extract and process the response
      const aiResponse = completion.choices[0]?.message?.content || '';
      const entities = await this.extractEntities(message);
      const intent = await this.detectIntent(message, entities);

      // Update context with the new message
      contextManager.updateContext(userId, sessionId, {
        role: 'user',
        content: message,
        timestamp: new Date(),
        metadata: { intent, entities }
      });

      return this.createResponse(aiResponse, 0.9, intent, entities);
    } catch (error) {
      console.error('Error processing message:', error);
      return this.createResponse(
        'I apologize, but I encountered an error processing your request.',
        0.5,
        'error'
      );
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

  private generateSystemPrompt(context: any): string {
    const { userPreferences } = context;
    return `
      You are an AI assistant with the following preferences:
      - Language: ${userPreferences?.language || 'en'}
      - Response Style: ${userPreferences?.responseStyle || 'concise'}
      - Timezone: ${userPreferences?.timezone || 'UTC'}
      
      Maintain conversation context and provide relevant, contextual responses.
      If you're unsure about something, ask for clarification.
      Always aim to be helpful while maintaining a natural conversation flow.
    `.trim();
  }

  private prepareConversationHistory(messages: Message[]): any[] {
    return messages.map(msg => ({
      role: msg.role,
      content: msg.content
    }));
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

  private createResponse(
    text: string,
    confidence: number,
    intent: string,
    entities: Entity[] = []
  ): AIResponse {
    return {
      text,
      confidence,
      context: {
        intent,
        entities,
        followUpQuestions: this.generateFollowUpQuestions(text, intent)
      }
    };
  }

  private generateFollowUpQuestions(response: string, intent: string): string[] {
    // Simple logic to generate follow-up questions based on the response and intent
    const questions: string[] = [];
    
    if (intent === 'greeting') {
      questions.push('What can I help you with today?');
    } else if (response.length > 100) {
      questions.push('Would you like me to explain anything in more detail?');
      questions.push('Do you have any specific questions about what I\'ve explained?');
    }

    return questions;
  }
}

export const enhancedAI = EnhancedAI.getInstance();
