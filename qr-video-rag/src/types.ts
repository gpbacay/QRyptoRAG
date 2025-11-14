/**
 * QR Video RAG - Type Definitions
 * 
 * High-density knowledge storage for RAG systems using QR-encoded video
 */

/**
 * Configuration options for QR Video Store
 */
export interface QRVideoStoreConfig {
  /** Size of text chunks in characters (default: 500) */
  chunkSize?: number;
  /** Overlap between chunks in characters (default: 50) */
  chunkOverlap?: number;
  /** Video frame rate (default: 1 FPS) */
  videoFps?: number;
  /** QR code error correction level (default: 'M') */
  qrErrorCorrectionLevel?: 'L' | 'M' | 'Q' | 'H';
  /** Video resolution (default: 256x256) */
  videoResolution?: { width: number; height: number };
  /** Enable verbose logging (default: false) */
  verbose?: boolean;
}

/**
 * Text chunk with metadata
 */
export interface Chunk {
  /** The text content of the chunk */
  text: string;
  /** Index of the chunk in the document */
  index: number;
  /** Optional metadata */
  metadata?: Record<string, any>;
}

/**
 * Entry in the QR Video Store index
 */
export interface QRVideoStoreIndexEntry {
  /** The text content of the chunk */
  chunkText: string;
  /** Vector embedding of the chunk */
  embedding: number[];
  /** Frame number in the video (0-indexed) */
  frameNumber: number;
  /** Document identifier */
  documentId: string;
  /** Optional similarity score from search */
  similarity?: number;
  /** Optional metadata */
  metadata?: Record<string, any>;
}

/**
 * Interface for vector database operations
 */
export interface VectorDatabase {
  /**
   * Insert or update entries in the database
   * @param entries Array of index entries to upsert
   */
  upsert(entries: QRVideoStoreIndexEntry[]): Promise<void>;

  /**
   * Search for similar entries
   * @param embedding Query embedding vector
   * @param limit Maximum number of results
   * @returns Array of matching entries with similarity scores
   */
  search(embedding: number[], limit: number): Promise<QRVideoStoreIndexEntry[]>;

  /**
   * Optional: Delete entries by document ID
   * @param documentId Document identifier
   */
  delete?(documentId: string): Promise<void>;

  /**
   * Optional: Clear all entries
   */
  clear?(): Promise<void>;
}

/**
 * Interface for embedding generation
 */
export interface Embedder {
  /**
   * Generate embedding vector for text
   * @param text Input text
   * @returns Embedding vector
   */
  embed(text: string): Promise<number[]>;

  /**
   * Optional: Get embedding dimension
   */
  dimension?(): number;
}

/**
 * Interface for video storage backends
 */
export interface VideoStorageBackend {
  /**
   * Save video file
   * @param videoPath Path or key for the video
   * @param buffer Video file buffer
   */
  save(videoPath: string, buffer: Buffer): Promise<void>;

  /**
   * Load video file
   * @param videoPath Path or key for the video
   * @returns Video file buffer
   */
  load(videoPath: string): Promise<Buffer>;

  /**
   * Check if video exists
   * @param videoPath Path or key for the video
   */
  exists(videoPath: string): Promise<boolean>;

  /**
   * Optional: Delete video file
   * @param videoPath Path or key for the video
   */
  delete?(videoPath: string): Promise<void>;
}

/**
 * Search result with decoded text
 */
export interface SearchResult {
  /** Decoded text from QR code */
  text: string;
  /** Similarity score (0-1) */
  similarity: number;
  /** Frame number in video */
  frameNumber: number;
  /** Document ID */
  documentId: string;
  /** Optional metadata */
  metadata?: Record<string, any>;
}

/**
 * Statistics about a QR Video Store
 */
export interface QRVideoStoreStats {
  /** Total number of chunks */
  totalChunks: number;
  /** Total number of frames in video */
  totalFrames: number;
  /** Video file size in bytes */
  videoSizeBytes: number;
  /** Original text size in bytes */
  originalSizeBytes: number;
  /** Compression ratio (0-1) */
  compressionRatio: number;
  /** Video duration in seconds */
  durationSeconds: number;
}

/**
 * Options for building video
 */
export interface VideoBuildOptions {
  /** Output video path */
  outputPath: string;
  /** Video codec (default: 'libx264') */
  codec?: string;
  /** Pixel format (default: 'yuv420p') */
  pixelFormat?: string;
  /** Additional FFmpeg options */
  ffmpegOptions?: string[];
}

/**
 * Options for frame extraction
 */
export interface FrameExtractionOptions {
  /** Video path */
  videoPath: string;
  /** Frame number to extract (0-indexed) */
  frameNumber: number;
  /** Output format (default: 'png') */
  format?: 'png' | 'jpg';
}

