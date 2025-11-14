/**
 * QR Video RAG - Database Adapters
 *
 * Self-contained database adapters for the QR Video RAG system
 */

import { VectorDatabase, QRVideoStoreIndexEntry } from '../types';

/**
 * In-memory vector database adapter
 *
 * Simple implementation for testing and small datasets.
 * Uses cosine similarity for vector search.
 *
 * @param initialData Optional initial data to populate
 * @returns VectorDatabase implementation
 *
 * @example
 * ```typescript
 * const db = createInMemoryAdapter();
 * await db.upsert([...entries]);
 * const results = await db.search(embedding, 5);
 * ```
 */
export function createInMemoryAdapter(
  initialData: QRVideoStoreIndexEntry[] = []
): VectorDatabase {
  const store: QRVideoStoreIndexEntry[] = [...initialData];

  return {
    async upsert(entries: QRVideoStoreIndexEntry[]): Promise<void> {
      // Simple append (no deduplication)
      store.push(...entries);
    },

    async search(embedding: number[], limit: number): Promise<QRVideoStoreIndexEntry[]> {
      if (store.length === 0) {
        return [];
      }

      // Calculate cosine similarity for all entries
      const results = store.map(entry => {
        const similarity = cosineSimilarity(embedding, entry.embedding);
        return { ...entry, similarity };
      });

      // Sort by similarity (highest first) and take top N
      results.sort((a, b) => (b.similarity || 0) - (a.similarity || 0));
      return results.slice(0, limit);
    },

    async delete(documentId: string): Promise<void> {
      const indicesToRemove: number[] = [];
      for (let i = store.length - 1; i >= 0; i--) {
        if (store[i].documentId === documentId) {
          indicesToRemove.push(i);
        }
      }

      for (const index of indicesToRemove) {
        store.splice(index, 1);
      }
    },

    async clear(): Promise<void> {
      store.length = 0;
    },
  };
}

/**
 * Calculate cosine similarity between two vectors
 */
function cosineSimilarity(a: number[], b: number[]): number {
  if (a.length !== b.length) {
    throw new Error('Vectors must have same length');
  }

  let dotProduct = 0;
  let magA = 0;
  let magB = 0;

  for (let i = 0; i < a.length; i++) {
    dotProduct += a[i] * b[i];
    magA += a[i] * a[i];
    magB += b[i] * b[i];
  }

  magA = Math.sqrt(magA);
  magB = Math.sqrt(magB);

  if (magA === 0 || magB === 0) {
    return 0;
  }

  return dotProduct / (magA * magB);
}

