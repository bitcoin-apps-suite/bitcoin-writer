import { HandCashService } from './HandCashService';

export interface AIProvider {
  id: string;
  name: string;
  apiKeyRequired: boolean;
  endpoint?: string;
}

export interface AIMessage {
  role: 'user' | 'assistant' | 'system';
  content: string;
}

export interface AIResponse {
  content: string;
  tokensUsed?: number;
  model?: string;
  utxoHash?: string; // For version control
}

export interface AIInteraction {
  timestamp: Date;
  provider: string;
  prompt: string;
  response: string;
  utxoHash: string;
  previousHash?: string; // Creates chain of interactions
}

export class AIService {
  private apiKeys: Map<string, string> = new Map();
  private interactionChain: AIInteraction[] = [];
  private handCashService: HandCashService;

  constructor(handCashService: HandCashService) {
    this.handCashService = handCashService;
    this.loadApiKeys();
  }

  private loadApiKeys(): void {
    // Load from localStorage
    const savedKeys = localStorage.getItem('aiApiKeys');
    if (savedKeys) {
      const keysObj = JSON.parse(savedKeys);
      Object.entries(keysObj).forEach(([provider, key]) => {
        this.apiKeys.set(provider, key as string);
      });
    }
  }

  public setApiKey(provider: string, apiKey: string): void {
    this.apiKeys.set(provider, apiKey);
    const keysObj = Object.fromEntries(this.apiKeys);
    localStorage.setItem('aiApiKeys', JSON.stringify(keysObj));
  }

  public async generateResponse(
    prompt: string,
    provider: string,
    context?: AIMessage[]
  ): Promise<AIResponse> {
    switch (provider) {
      case 'gemini':
        return this.callGeminiAPI(prompt, context);
      case 'openai':
        return this.callOpenAIAPI(prompt, context);
      case 'claude':
        return this.callClaudeAPI(prompt, context);
      case 'local':
        return this.callLocalLLM(prompt, context);
      default:
        throw new Error(`Unknown provider: ${provider}`);
    }
  }

  private async callGeminiAPI(prompt: string, context?: AIMessage[]): Promise<AIResponse> {
    const apiKey = this.apiKeys.get('gemini');
    if (!apiKey) {
      throw new Error('Gemini API key not configured. Please add your API key in settings.');
    }

    const endpoint = `https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=${apiKey}`;

    try {
      const messages = context ? this.formatMessagesForGemini(context) : [];
      messages.push({ role: 'user', parts: [{ text: prompt }] });

      const response = await fetch(endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          contents: messages,
          generationConfig: {
            temperature: 0.7,
            topK: 40,
            topP: 0.95,
            maxOutputTokens: 2048,
          },
        }),
      });

      if (!response.ok) {
        throw new Error(`Gemini API error: ${response.statusText}`);
      }

      const data = await response.json();
      const content = data.candidates[0].content.parts[0].text;

      // Create UTXO hash for this interaction
      const utxoHash = await this.createInteractionHash(prompt, content, 'gemini');

      return {
        content,
        model: 'gemini-pro',
        utxoHash,
      };
    } catch (error) {
      console.error('Gemini API error:', error);
      throw error;
    }
  }

  private async callOpenAIAPI(prompt: string, context?: AIMessage[]): Promise<AIResponse> {
    const apiKey = this.apiKeys.get('openai');
    if (!apiKey) {
      throw new Error('OpenAI API key not configured. Please add your API key in settings.');
    }

    const endpoint = 'https://api.openai.com/v1/chat/completions';

    try {
      const messages = context || [];
      messages.push({ role: 'user', content: prompt });

      const response = await fetch(endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${apiKey}`,
        },
        body: JSON.stringify({
          model: 'gpt-4-turbo-preview',
          messages,
          temperature: 0.7,
          max_tokens: 2048,
        }),
      });

      if (!response.ok) {
        throw new Error(`OpenAI API error: ${response.statusText}`);
      }

      const data = await response.json();
      const content = data.choices[0].message.content;

      const utxoHash = await this.createInteractionHash(prompt, content, 'openai');

      return {
        content,
        model: data.model,
        tokensUsed: data.usage?.total_tokens,
        utxoHash,
      };
    } catch (error) {
      console.error('OpenAI API error:', error);
      throw error;
    }
  }

  private async callClaudeAPI(prompt: string, context?: AIMessage[]): Promise<AIResponse> {
    const apiKey = this.apiKeys.get('claude');
    if (!apiKey) {
      throw new Error('Claude API key not configured. Please add your API key in settings.');
    }

    const endpoint = 'https://api.anthropic.com/v1/messages';

    try {
      const messages = context || [];
      messages.push({ role: 'user', content: prompt });

      const response = await fetch(endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-api-key': apiKey,
          'anthropic-version': '2023-06-01',
        },
        body: JSON.stringify({
          model: 'claude-3-opus-20240229',
          max_tokens: 2048,
          messages,
        }),
      });

      if (!response.ok) {
        throw new Error(`Claude API error: ${response.statusText}`);
      }

      const data = await response.json();
      const content = data.content[0].text;

      const utxoHash = await this.createInteractionHash(prompt, content, 'claude');

      return {
        content,
        model: 'claude-3-opus',
        utxoHash,
      };
    } catch (error) {
      console.error('Claude API error:', error);
      throw error;
    }
  }

  private async callLocalLLM(prompt: string, context?: AIMessage[]): Promise<AIResponse> {
    // Placeholder for local LLM integration (e.g., Ollama)
    const endpoint = 'http://localhost:11434/api/generate';

    try {
      const response = await fetch(endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: 'llama2',
          prompt,
          stream: false,
        }),
      });

      if (!response.ok) {
        throw new Error('Local LLM not available. Please ensure Ollama is running.');
      }

      const data = await response.json();
      const content = data.response;

      const utxoHash = await this.createInteractionHash(prompt, content, 'local');

      return {
        content,
        model: 'llama2',
        utxoHash,
      };
    } catch (error) {
      console.error('Local LLM error:', error);
      throw new Error('Local LLM not available. Please ensure your local model server is running.');
    }
  }

  private formatMessagesForGemini(messages: AIMessage[]): any[] {
    return messages.map(msg => ({
      role: msg.role === 'assistant' ? 'model' : msg.role,
      parts: [{ text: msg.content }],
    }));
  }

  private async createInteractionHash(
    prompt: string,
    response: string,
    provider: string
  ): Promise<string> {
    const timestamp = new Date();
    const previousHash = this.interactionChain.length > 0
      ? this.interactionChain[this.interactionChain.length - 1].utxoHash
      : '0';

    // Create hash of the interaction
    const interactionData = {
      timestamp: timestamp.toISOString(),
      provider,
      prompt,
      response,
      previousHash,
    };

    // Use crypto API to create hash
    const encoder = new TextEncoder();
    const data = encoder.encode(JSON.stringify(interactionData));
    const hashBuffer = await crypto.subtle.digest('SHA-256', data);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    const utxoHash = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');

    // Add to interaction chain
    const interaction: AIInteraction = {
      timestamp,
      provider,
      prompt,
      response,
      utxoHash,
      previousHash,
    };

    this.interactionChain.push(interaction);
    this.saveInteractionChain();

    // Optionally write to blockchain
    if (this.handCashService.getCurrentUser()) {
      try {
        await this.writeInteractionToChain(interaction);
      } catch (error) {
        console.error('Failed to write interaction to blockchain:', error);
      }
    }

    return utxoHash;
  }

  private async writeInteractionToChain(interaction: AIInteraction): Promise<void> {
    // This would write the interaction hash to the blockchain
    // Creating a UTXO chain for version control
    const metadata = {
      type: 'ai-interaction',
      provider: interaction.provider,
      hash: interaction.utxoHash,
      previousHash: interaction.previousHash,
      timestamp: interaction.timestamp.toISOString(),
    };

    // Use a minimal amount of satoshis for the UTXO
    // This creates an on-chain record of the AI interaction
    console.log('Would write to chain:', metadata);
    // Actual implementation would use HandCash or BSV library
  }

  private saveInteractionChain(): void {
    // Save to localStorage for persistence
    localStorage.setItem('aiInteractionChain', JSON.stringify(this.interactionChain));
  }

  public loadInteractionChain(): void {
    const saved = localStorage.getItem('aiInteractionChain');
    if (saved) {
      this.interactionChain = JSON.parse(saved, (key, value) => {
        if (key === 'timestamp') {
          return new Date(value);
        }
        return value;
      });
    }
  }

  public getInteractionChain(): AIInteraction[] {
    return this.interactionChain;
  }

  public getProviders(): AIProvider[] {
    return [
      { id: 'gemini', name: 'Gemini AI', apiKeyRequired: true },
      { id: 'openai', name: 'OpenAI GPT', apiKeyRequired: true },
      { id: 'claude', name: 'Claude', apiKeyRequired: true },
      { id: 'local', name: 'Local LLM', apiKeyRequired: false },
    ];
  }

  public hasApiKey(provider: string): boolean {
    return this.apiKeys.has(provider);
  }
}