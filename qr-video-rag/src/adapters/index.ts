/**
 * QR Video RAG - Adapters Index
 * 
 * Export all adapters from a single entry point
 */

// Database adapters
export {
  createInMemoryAdapter,
} from './database';

// Embedder adapters
export {
  createSimpleEmbedder,
  createCustomEmbedder,
} from './embedders';

