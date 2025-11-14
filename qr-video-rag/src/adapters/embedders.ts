/**
 * QR Video RAG - Embedder Adapters
 * 
 * Adapters for various embedding generation services
 */

import { Embedder } from '../types';

/**
 * Google Gemini embeddings adapter (Primary - Recommended)
 * 
 * Uses Google Gemini's text-embedding models via Genkit
 * 
 * @param apiKey Google Gemini API key (from .env.local as GEMINI_API_KEY)
 * @param model Model name (default: 'text-embedding-004')
 * @returns Embedder implementation
 * 
 * @example
 * ```typescript
 * const embedder = createGeminiEmbedder(
 *   process.env.GEMINI_API_KEY!,
 *   'text-embedding-004'
 * );
 * 
 * const embedding = await embedder.embed("Hello world");
 * console.log(embedding.length); // 768
 * ```
 */
export function createGeminiEmbedder(
  apiKey: string,
  model: string = 'text-embedding-004'
): Embedder {
  return {
    async embed(text: string): Promise<number[]> {
      const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:embedContent?key=${apiKey}`;
      
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          content: {
            parts: [{ text }]
          },
        }),
      });

      if (!response.ok) {
        const error: any = await response.json();
        throw new Error(`Google Gemini API error: ${error.error?.message || response.statusText}`);
      }

      const data: any = await response.json();
      return data.embedding.values;
    },

    dimension(): number {
      return 768; // text-embedding-004 dimension
    },
  };
}

/**
 * Google AI embeddings adapter (Alternative name for createGeminiEmbedder)
 * 
 * Uses Google's text-embedding models
 * 
 * @param apiKey Google Gemini API key (from .env.local as GEMINI_API_KEY)
 * @param model Model name (default: 'text-embedding-004')
 * @returns Embedder implementation
 * 
 * @example
 * ```typescript
 * const embedder = createGoogleAIEmbedder(
 *   process.env.GEMINI_API_KEY!
 * );
 * ```
 */
export function createGoogleAIEmbedder(
  apiKey: string,
  model: string = 'text-embedding-004'
): Embedder {
  return {
    async embed(text: string): Promise<number[]> {
      const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:embedContent?key=${apiKey}`;
      
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          content: {
            parts: [{ text }]
          },
        }),
      });

      if (!response.ok) {
        const error: any = await response.json();
        throw new Error(`Google Gemini API error: ${error.error?.message || response.statusText}`);
      }

      const data: any = await response.json();
      return data.embedding.values;
    },

    dimension(): number {
      return 768; // text-embedding-004 dimension
    },
  };
}

/**
 * Cohere embeddings adapter
 * 
 * @param apiKey Cohere API key
 * @param model Model name (default: 'embed-english-v3.0')
 * @returns Embedder implementation
 * 
 * @example
 * ```typescript
 * const embedder = createCohereEmbedder(
 *   process.env.COHERE_API_KEY!
 * );
 * ```
 */
export function createCohereEmbedder(
  apiKey: string,
  model: string = 'embed-english-v3.0',
  inputType: 'search_document' | 'search_query' | 'classification' | 'clustering' = 'search_document'
): Embedder {
  return {
    async embed(text: string): Promise<number[]> {
      const response = await fetch('https://api.cohere.ai/v1/embed', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${apiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          texts: [text],
          model,
          input_type: inputType,
        }),
      });

      if (!response.ok) {
        const error: any = await response.json();
        throw new Error(`Cohere API error: ${error.message || response.statusText}`);
      }

      const data: any = await response.json();
      return data.embeddings[0];
    },

    dimension(): number {
      return 1024; // embed-english-v3.0 dimension
    },
  };
}

/**
 * Hugging Face embeddings adapter
 * 
 * @param apiKey Hugging Face API key
 * @param model Model name (default: 'sentence-transformers/all-MiniLM-L6-v2')
 * @returns Embedder implementation
 * 
 * @example
 * ```typescript
 * const embedder = createHuggingFaceEmbedder(
 *   process.env.HF_API_KEY!,
 *   'sentence-transformers/all-mpnet-base-v2'
 * );
 * ```
 */
export function createHuggingFaceEmbedder(
  apiKey: string,
  model: string = 'sentence-transformers/all-MiniLM-L6-v2'
): Embedder {
  return {
    async embed(text: string): Promise<number[]> {
      const url = `https://api-inference.huggingface.co/pipeline/feature-extraction/${model}`;
      
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${apiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          inputs: text,
        }),
      });

      if (!response.ok) {
        const error: any = await response.json();
        throw new Error(`Hugging Face API error: ${error.error || response.statusText}`);
      }

      const data: any = await response.json();
      // HF returns nested array, flatten it
      return Array.isArray(data[0]) ? data[0] : data as number[];
    },
  };
}

/**
 * Mock embedder for testing
 * 
 * Generates consistent but meaningless embeddings for testing
 * 
 * @param dimension Embedding dimension (default: 384)
 * @returns Embedder implementation
 * 
 * @example
 * ```typescript
 * const embedder = createMockEmbedder(768);
 * const embedding = await embedder.embed("test");
 * ```
 */
export function createMockEmbedder(dimension: number = 384): Embedder {
  return {
    async embed(text: string): Promise<number[]> {
      // Generate deterministic "embedding" based on text hash
      const hash = simpleHash(text);
      const embedding: number[] = [];
      
      for (let i = 0; i < dimension; i++) {
        // Use hash to seed pseudo-random values
        const value = Math.sin(hash + i) * 0.5 + 0.5;
        embedding.push(value);
      }

      // Normalize to unit vector
      const magnitude = Math.sqrt(embedding.reduce((sum, val) => sum + val * val, 0));
      return embedding.map(val => val / magnitude);
    },

    dimension(): number {
      return dimension;
    },
  };
}

/**
 * Simple string hash function
 */
function simpleHash(str: string): number {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash; // Convert to 32-bit integer
  }
  return Math.abs(hash);
}

/**
 * Custom embedder wrapper
 * 
 * Allows you to provide your own embedding function
 * 
 * @param embedFn Function that generates embeddings
 * @param dimension Optional embedding dimension
 * @returns Embedder implementation
 * 
 * @example
 * ```typescript
 * const embedder = createCustomEmbedder(
 *   async (text) => {
 *     // Your custom embedding logic
 *     return myModel.encode(text);
 *   },
 *   512
 * );
 * ```
 */
export function createCustomEmbedder(
  embedFn: (text: string) => Promise<number[]>,
  dimension?: number
): Embedder {
  return {
    embed: embedFn,
    dimension: dimension ? () => dimension : undefined,
  };
}

/**
 * Cached embedder wrapper
 * 
 * Wraps any embedder with a simple LRU cache
 * 
 * @param embedder Base embedder to wrap
 * @param maxCacheSize Maximum number of cached embeddings
 * @returns Cached embedder implementation
 * 
 * @example
 * ```typescript
 * const baseEmbedder = createGeminiEmbedder(apiKey);
 * const cachedEmbedder = createCachedEmbedder(baseEmbedder, 1000);
 * ```
 */
export function createCachedEmbedder(
  embedder: Embedder,
  maxCacheSize: number = 500
): Embedder {
  const cache = new Map<string, number[]>();

  return {
    async embed(text: string): Promise<number[]> {
      // Check cache
      const cached = cache.get(text);
      if (cached) {
        return cached;
      }

      // Generate embedding
      const embedding = await embedder.embed(text);

      // Add to cache with LRU eviction
      if (cache.size >= maxCacheSize) {
        const firstKey = cache.keys().next().value;
        if (firstKey) {
          cache.delete(firstKey);
        }
      }
      cache.set(text, embedding);

      return embedding;
    },

    dimension: embedder.dimension,
  };
}

/**
 * Batch embedder wrapper
 * 
 * Optimizes embedding generation by batching requests
 * 
 * @param embedder Base embedder (must support batching)
 * @param batchSize Number of texts to batch together
 * @returns Batched embedder implementation
 */
export function createBatchedEmbedder(
  embedder: Embedder & { embedBatch?: (texts: string[]) => Promise<number[][]> }
): Embedder & { embedBatch: (texts: string[]) => Promise<number[][]> } {
  return {
    async embed(text: string): Promise<number[]> {
      if (embedder.embedBatch) {
        const batch = await embedder.embedBatch([text]);
        return batch[0];
      }
      return embedder.embed(text);
    },

    async embedBatch(texts: string[]): Promise<number[][]> {
      if (embedder.embedBatch) {
        return embedder.embedBatch(texts);
      }

      // Fallback: call embed() for each text
      return Promise.all(texts.map(text => embedder.embed(text)));
    },

    dimension: embedder.dimension,
  };
}

