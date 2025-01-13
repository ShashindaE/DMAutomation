import { BaseAgent } from '../base-agent';
import { AgentConfig, TrainingData } from '../types';
import { openai } from '../../../openai';

export class CustomerServiceAgent extends BaseAgent {
  constructor(config: AgentConfig, trainingData: TrainingData[] = []) {
    super({
      ...config,
      capabilities: ['CUSTOMER_SERVICE'],
      systemPrompt: `You are a professional customer service agent. Your role is to:
        - Provide helpful and courteous support
        - Address customer concerns empathetically
        - Follow company policies and guidelines
        - Escalate complex issues when necessary
        - Maintain a professional tone at all times`
    }, trainingData);
  }

  public async validateCapability(query: string): Promise<boolean> {
    try {
      const response = await openai.chat.completions.create({
        model: 'gpt-4-turbo-preview',
        messages: [
          {
            role: 'system',
            content: 'Analyze if the following query is related to customer service. Respond with only "true" or "false".'
          },
          { role: 'user', content: query }
        ],
        temperature: 0,
        max_tokens: 5
      });

      return response.choices[0]?.message?.content?.toLowerCase().includes('true') || false;
    } catch (error) {
      console.error('Error validating capability:', error);
      return false;
    }
  }

  protected override buildSystemMessage(): string {
    const baseMessage = super.buildSystemMessage();
    return `${baseMessage}\n\nCustomer Service Guidelines:
      1. Always greet the customer professionally
      2. Show empathy and understanding
      3. Provide clear and accurate information
      4. Offer solutions when possible
      5. Thank the customer for their patience`;
  }

  protected override async generateResponse(
    query: string,
    conversationHistory = []
  ): Promise<string> {
    // Analyze sentiment before generating response
    const sentiment = await this.analyzeSentiment(query);
    
    // Adjust temperature based on sentiment
    const adjustedTemp = sentiment === 'negative' ? 
      Math.max(0.3, this.config.temperature - 0.2) : // More conservative for negative sentiment
      this.config.temperature;

    // Update config temporarily for this response
    const originalTemp = this.config.temperature;
    this.config.temperature = adjustedTemp;

    try {
      const response = await super.generateResponse(query, conversationHistory);
      return response;
    } finally {
      // Restore original temperature
      this.config.temperature = originalTemp;
    }
  }

  private async analyzeSentiment(text: string): Promise<'positive' | 'neutral' | 'negative'> {
    try {
      const response = await openai.chat.completions.create({
        model: 'gpt-4-turbo-preview',
        messages: [
          {
            role: 'system',
            content: 'Analyze the sentiment of the following text. Respond with only "positive", "neutral", or "negative".'
          },
          { role: 'user', content: text }
        ],
        temperature: 0,
        max_tokens: 10
      });

      const sentiment = response.choices[0]?.message?.content?.toLowerCase() || 'neutral';
      return sentiment as 'positive' | 'neutral' | 'negative';
    } catch (error) {
      console.error('Error analyzing sentiment:', error);
      return 'neutral';
    }
  }
}
