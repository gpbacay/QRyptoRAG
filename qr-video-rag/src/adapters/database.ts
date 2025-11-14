/**
 * QR Video RAG - Database Adapters
 * 
 * Adapters for various vector database backends
 */

import { VectorDatabase, QRVideoStoreIndexEntry } from '../types';

/**
 * Supabase adapter for vector database operations
 * 
 * Requires a Supabase table with pgvector extension and RPC function
 * 
 * @param client Supabase client instance
 * @param tableName Name of the table (default: 'qr_video_store_index')
 * @param rpcFunctionName Name of the RPC function for similarity search
 * @returns VectorDatabase implementation
 * 
 * @example
 * ```typescript
 * import { createClient } from '@supabase/supabase-js';
 * 
 * const supabase = createClient(url, key);
 * const db = createSupabaseAdapter(supabase);
 * ```
 */
export function createSupabaseAdapter(
  client: any, // SupabaseClient type (peer dependency)
  tableName: string = 'qr_video_store_index',
  rpcFunctionName: string = 'match_qr_video_store_chunks'
): VectorDatabase {
  return {
    async upsert(entries: QRVideoStoreIndexEntry[]): Promise<void> {
      const dbEntries = entries.map(entry => ({
        chunk_text: entry.chunkText,
        embedding: entry.embedding,
        frame_number: entry.frameNumber,
        document_id: entry.documentId,
        chunk_index: entry.frameNumber,
        metadata: entry.metadata || {},
        created_at: new Date().toISOString(),
      }));

      const { error } = await client.from(tableName).insert(dbEntries);
      
      if (error) {
        throw new Error(`Supabase upsert error: ${error.message}`);
      }
    },

    async search(embedding: number[], limit: number): Promise<QRVideoStoreIndexEntry[]> {
      const { data, error } = await client.rpc(rpcFunctionName, {
        query_embedding: embedding,
        match_count: limit,
      });

      if (error) {
        throw new Error(`Supabase search error: ${error.message}`);
      }

      if (!data) {
        return [];
      }

      // Transform Supabase response to QRVideoStoreIndexEntry
      return data.map((row: any) => ({
        chunkText: row.chunk_text,
        embedding: row.embedding,
        frameNumber: row.frame_number,
        documentId: row.document_id,
        similarity: row.similarity,
        metadata: row.metadata || {},
      }));
    },

    async delete(documentId: string): Promise<void> {
      const { error } = await client
        .from(tableName)
        .delete()
        .eq('document_id', documentId);

      if (error) {
        throw new Error(`Supabase delete error: ${error.message}`);
      }
    },

    async clear(): Promise<void> {
      const { error } = await client.from(tableName).delete().neq('id', 0);

      if (error) {
        throw new Error(`Supabase clear error: ${error.message}`);
      }
    },
  };
}

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

/**
 * File-based vector database adapter (JSON storage)
 * 
 * Persists data to a JSON file. Useful for small datasets
 * that need to persist between runs.
 * 
 * @param filePath Path to JSON file
 * @returns VectorDatabase implementation
 * 
 * @example
 * ```typescript
 * const db = createFileAdapter('./data/index.json');
 * ```
 */
export function createFileAdapter(filePath: string): VectorDatabase {
  const fs = require('fs');
  const path = require('path');

  // Ensure directory exists
  const dir = path.dirname(filePath);
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }

  // Load existing data
  let store: QRVideoStoreIndexEntry[] = [];
  if (fs.existsSync(filePath)) {
    try {
      const data = fs.readFileSync(filePath, 'utf8');
      store = JSON.parse(data);
    } catch (error) {
      console.warn(`Failed to load file adapter data: ${error}`);
      store = [];
    }
  }

  // Save function
  const save = () => {
    try {
      fs.writeFileSync(filePath, JSON.stringify(store, null, 2), 'utf8');
    } catch (error) {
      console.error(`Failed to save file adapter data: ${error}`);
    }
  };

  return {
    async upsert(entries: QRVideoStoreIndexEntry[]): Promise<void> {
      store.push(...entries);
      save();
    },

    async search(embedding: number[], limit: number): Promise<QRVideoStoreIndexEntry[]> {
      if (store.length === 0) {
        return [];
      }

      const results = store.map(entry => {
        const similarity = cosineSimilarity(embedding, entry.embedding);
        return { ...entry, similarity };
      });

      results.sort((a, b) => (b.similarity || 0) - (a.similarity || 0));
      return results.slice(0, limit);
    },

    async delete(documentId: string): Promise<void> {
      store = store.filter(entry => entry.documentId !== documentId);
      save();
    },

    async clear(): Promise<void> {
      store = [];
      save();
    },
  };
}

/**
 * Create a custom database adapter
 * 
 * @param implementation Custom implementation of VectorDatabase interface
 * @returns VectorDatabase implementation
 */
export function createCustomAdapter(
  implementation: VectorDatabase
): VectorDatabase {
  return implementation;
}

