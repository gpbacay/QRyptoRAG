/**
 * QR Video RAG - Embedder Adapters
 *
 * Self-contained embedder implementations for the QR Video RAG system
 */

import { Embedder } from '../types';

/**
 * Simple embedder using text hashing
 *
 * Generates deterministic embeddings based on text content for the QR Video RAG system.
 * This embedder is completely self-contained and doesn't require any external APIs.
 *
 * @param dimension Embedding dimension (default: 384)
 * @returns Embedder implementation
 *
 * @example
 * ```typescript
 * const embedder = createSimpleEmbedder(384);
 * const embedding = await embedder.embed("Hello world");
 * console.log(embedding.length); // 384
 * ```
 */
export function createSimpleEmbedder(dimension: number = 384): Embedder {
  return {
    async embed(text: string): Promise<number[]> {
      // Generate deterministic "embedding" based on text hash and character patterns
      const hash = simpleHash(text);
      const charHash = characterPatternHash(text);
      const embedding: number[] = [];

      for (let i = 0; i < dimension; i++) {
        // Combine multiple hash functions for better distribution
        const value = (Math.sin(hash + i) + Math.cos(charHash + i) + Math.sin(text.length + i)) / 3;
        // Normalize to 0-1 range
        embedding.push((value + 1) / 2);
      }

      // Normalize to unit vector for better similarity calculations
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
 * Character pattern hash for better text differentiation
 */
function characterPatternHash(str: string): number {
  let hash = 0;
  // Count different character types
  let letters = 0, numbers = 0, spaces = 0, punctuation = 0;

  for (let i = 0; i < str.length; i++) {
    const char = str[i];
    if (char.match(/[a-zA-Z]/)) letters++;
    else if (char.match(/[0-9]/)) numbers++;
    else if (char === ' ') spaces++;
    else if (char.match(/[.,!?;:]/)) punctuation++;
  }

  // Combine counts into hash
  hash = letters * 1000 + numbers * 100 + spaces * 10 + punctuation;
  return hash;
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


