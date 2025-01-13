import { BaseAgent } from './base-agent';
import { CustomerServiceAgent } from './specialized/customer-service-agent';
import { AgentCapability, AgentConfig, TrainingData } from './types';

export class AgentFactory {
  private static instance: AgentFactory;
  private agents: Map<string, BaseAgent> = new Map();

  private constructor() {}

  public static getInstance(): AgentFactory {
    if (!AgentFactory.instance) {
      AgentFactory.instance = new AgentFactory();
    }
    return AgentFactory.instance;
  }

  public createAgent(
    config: AgentConfig,
    trainingData: TrainingData[] = []
  ): BaseAgent {
    const existingAgent = this.agents.get(config.id);
    if (existingAgent) {
      return existingAgent;
    }

    let agent: BaseAgent;

    // Create specific agent based on capabilities
    if (this.hasCapability(config.capabilities, 'CUSTOMER_SERVICE')) {
      agent = new CustomerServiceAgent(config, trainingData);
    } else {
      throw new Error(`No agent implementation for capabilities: ${config.capabilities.join(', ')}`);
    }

    this.agents.set(config.id, agent);
    return agent;
  }

  public getAgent(id: string): BaseAgent | undefined {
    return this.agents.get(id);
  }

  public removeAgent(id: string): void {
    this.agents.delete(id);
  }

  private hasCapability(capabilities: AgentCapability[], capability: AgentCapability): boolean {
    return capabilities.includes(capability);
  }
}

export const agentFactory = AgentFactory.getInstance();
