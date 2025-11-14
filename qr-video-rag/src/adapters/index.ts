/**
 * QR Video RAG - Adapters Index
 * 
 * Export all adapters from a single entry point
 */

// Database adapters
export {
  createSupabaseAdapter,
  createInMemoryAdapter,
  createFileAdapter,
  createCustomAdapter,
} from './database';

// Embedder adapters
export {
  createGeminiEmbedder,
  createGoogleAIEmbedder,
  createCohereEmbedder,
  createHuggingFaceEmbedder,
  createMockEmbedder,
  createCustomEmbedder,
  createCachedEmbedder,
  createBatchedEmbedder,
} from './embedders';

