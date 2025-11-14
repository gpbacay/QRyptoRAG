/**
 * QR Video RAG - Main Entry Point
 * 
 * High-density knowledge storage for RAG systems using QR-encoded video
 * 
 * @packageDocumentation
 */

// Core classes
export { QRVideoStoreEncoder } from './encoder';
export { QRVideoStoreRetriever } from './retriever';

// Type definitions
export type {
  QRVideoStoreConfig,
  Chunk,
  QRVideoStoreIndexEntry,
  VectorDatabase,
  Embedder,
  VideoStorageBackend,
  SearchResult,
  QRVideoStoreStats,
  VideoBuildOptions,
  FrameExtractionOptions,
} from './types';

// Adapters
export {
  // Database adapters
  createInMemoryAdapter,
  // Embedder adapters
  createSimpleEmbedder,
  createCustomEmbedder,
} from './adapters';

/**
 * Package version
 */
export const VERSION = '1.0.0';

/**
 * Package name
 */
export const PACKAGE_NAME = 'qr-video-rag';

