/**
 * QR Video RAG - Retriever
 * 
 * Retrieves knowledge from QR-encoded videos using semantic search
 */

import ffmpeg from 'fluent-ffmpeg';
import ffmpegStatic from 'ffmpeg-static';
import { Jimp } from 'jimp';
import jsQR from 'jsqr';
import { PassThrough } from 'stream';
import * as fs from 'fs';
import {
  VectorDatabase,
  Embedder,
  QRVideoStoreIndexEntry,
  SearchResult,
  FrameExtractionOptions,
} from './types';

if (ffmpegStatic) {
  ffmpeg.setFfmpegPath(ffmpegStatic);
}

/**
 * QR Video Store Retriever
 * 
 * Performs semantic search and retrieves decoded text from QR-encoded videos
 */
export class QRVideoStoreRetriever {
  private database: VectorDatabase;
  private embedder: Embedder;
  private verbose: boolean;

  // Cache for decoded frames to avoid re-decoding
  private frameCache: Map<string, string>;
  private maxCacheSize: number;

  /**
   * Create a new QR Video Store Retriever
   * 
   * @param database Vector database containing chunk embeddings
   * @param embedder Embedding generator for query encoding
   * @param options Optional configuration
   * 
   * @example
 * ```typescript
 * const retriever = new QRVideoStoreRetriever(
 *   createSupabaseAdapter(supabase),
 *   createGeminiEmbedder(apiKey),
 *   { verbose: true, maxCacheSize: 100 }
 * );
 * ```
   */
  constructor(
    database: VectorDatabase,
    embedder: Embedder,
    options?: {
      verbose?: boolean;
      maxCacheSize?: number;
    }
  ) {
    this.database = database;
    this.embedder = embedder;
    this.verbose = options?.verbose ?? false;
    this.maxCacheSize = options?.maxCacheSize ?? 50;
    this.frameCache = new Map();
  }

  /**
   * Retrieve relevant chunk metadata based on semantic search
   * 
   * @param query Search query text
   * @param matchCount Number of results to return
   * @returns Array of matching index entries with similarity scores
   * 
   * @example
   * ```typescript
   * const matches = await retriever.retrieveChunks(
   *   "How do I configure authentication?",
   *   5
   * );
   * console.log(matches[0].similarity); // 0.85
   * ```
   */
  public async retrieveChunks(
    query: string,
    matchCount: number = 5
  ): Promise<QRVideoStoreIndexEntry[]> {
    if (this.verbose) {
      console.log(`[QRVideoStoreRetriever] Searching for: "${query}"`);
    }

    const embedding = await this.embedder.embed(query);
    const results = await this.database.search(embedding, matchCount);

    if (this.verbose) {
      console.log(`[QRVideoStoreRetriever] Found ${results.length} matches`);
    }

    return results;
  }

  /**
   * Extract a specific frame from video as buffer
   * 
   * @param videoPath Path to the video file
   * @param frameNumber Frame number to extract (0-indexed)
   * @returns Buffer containing PNG image data, or null if extraction fails
   * 
   * @example
   * ```typescript
   * const frameBuffer = await retriever.extractFrameAsBuffer(
   *   "./knowledge.mp4",
   *   42
   * );
   * if (frameBuffer) {
   *   fs.writeFileSync("frame-42.png", frameBuffer);
   * }
   * ```
   */
  public async extractFrameAsBuffer(
    videoPath: string,
    frameNumber: number,
    options?: Partial<FrameExtractionOptions>
  ): Promise<Buffer | null> {
    // Check if video exists
    if (!fs.existsSync(videoPath)) {
      throw new Error(`Video file not found: ${videoPath}`);
    }

    return new Promise((resolve) => {
      const format = options?.format ?? 'png';
      
      const command = ffmpeg(videoPath)
        .seekInput(frameNumber) // Seek by frame number
        .frames(1)
        .outputOptions([
          '-f image2',
          '-vframes 1',
          `-c:v ${format}`
        ]);

      const passThrough = new PassThrough();
      const buffers: Buffer[] = [];

      passThrough.on('data', (chunk: Buffer) => buffers.push(chunk));
      passThrough.on('end', () => {
        const buffer = Buffer.concat(buffers);
        resolve(buffer.length > 0 ? buffer : null);
      });
      passThrough.on('error', (err) => {
        if (this.verbose) {
          console.error(`[QRVideoStoreRetriever] Frame extraction error:`, err);
        }
        resolve(null); // Return null instead of rejecting
      });

      command.pipe(passThrough, { end: true });
      command.on('error', (err) => {
        if (this.verbose) {
          console.error(`[QRVideoStoreRetriever] FFmpeg error:`, err);
        }
        resolve(null);
      });
    });
  }

  /**
   * Decode QR code from image buffer
   * 
   * @param imageBuffer Buffer containing PNG/JPG image data
   * @returns Decoded text, or null if QR code cannot be read
   * 
   * @example
   * ```typescript
   * const qrImage = fs.readFileSync("qr-code.png");
   * const text = await retriever.decodeQrCodeFromBuffer(qrImage);
   * console.log(text); // "Hello, World!"
   * ```
   */
  public async decodeQrCodeFromBuffer(
    imageBuffer: Buffer
  ): Promise<string | null> {
    try {
      const image = await Jimp.read(imageBuffer);
      const imageData = new Uint8ClampedArray(image.bitmap.data);
      const qrCode = jsQR(imageData, image.bitmap.width, image.bitmap.height);

      return qrCode ? qrCode.data : null;
    } catch (error) {
      if (this.verbose) {
        console.error('[QRVideoStoreRetriever] QR decode error:', error);
      }
      return null;
    }
  }

  /**
   * Search for relevant content and decode it from video
   * 
   * This is the main retrieval method that combines semantic search
   * with frame extraction and QR decoding.
   * 
   * @param query Search query text
   * @param videoPath Path to the QR video file
   * @param matchCount Number of results to return (default: 5)
   * @returns Array of search results with decoded text and similarity scores
   * 
   * @example
   * ```typescript
   * const results = await retriever.search(
   *   "authentication configuration",
   *   "./docs.mp4",
   *   3
   * );
   * 
   * for (const result of results) {
   *   console.log(`[${result.similarity.toFixed(2)}] ${result.text}`);
   * }
   * ```
   */
  public async search(
    query: string,
    videoPath: string,
    matchCount: number = 5
  ): Promise<SearchResult[]> {
    const startTime = Date.now();

    // Step 1: Semantic search
    const chunks = await this.retrieveChunks(query, matchCount);
    const results: SearchResult[] = [];

    if (this.verbose) {
      console.log(`[QRVideoStoreRetriever] Extracting and decoding ${chunks.length} frames...`);
    }

    // Step 2: Extract frames and decode QR codes
    for (const chunk of chunks) {
      const cacheKey = `${videoPath}:${chunk.frameNumber}`;
      
      // Check cache first
      let decodedText: string | null | undefined = this.frameCache.get(cacheKey);

      if (!decodedText) {
        // Extract frame
        const frameBuffer = await this.extractFrameAsBuffer(
          videoPath,
          chunk.frameNumber
        );

        if (!frameBuffer) {
          if (this.verbose) {
            console.warn(`[QRVideoStoreRetriever] Failed to extract frame ${chunk.frameNumber}`);
          }
          continue;
        }

        // Decode QR code
        decodedText = await this.decodeQrCodeFromBuffer(frameBuffer);

        if (!decodedText) {
          if (this.verbose) {
            console.warn(`[QRVideoStoreRetriever] Failed to decode QR from frame ${chunk.frameNumber}`);
          }
          continue;
        }

        // Cache the result
        this.addToCache(cacheKey, decodedText);
      }

      results.push({
        text: decodedText,
        similarity: chunk.similarity || 0,
        frameNumber: chunk.frameNumber,
        documentId: chunk.documentId,
        metadata: chunk.metadata,
      });
    }

    const duration = Date.now() - startTime;
    if (this.verbose) {
      console.log(`[QRVideoStoreRetriever] Retrieved ${results.length} results in ${duration}ms`);
    }

    return results;
  }

  /**
   * Search across multiple video files
   * 
   * @param query Search query text
   * @param videoPaths Array of video file paths
   * @param matchCountPerVideo Number of results per video
   * @returns Aggregated and sorted results from all videos
   * 
   * @example
   * ```typescript
   * const results = await retriever.searchMultiple(
   *   "API documentation",
   *   ["./docs-v1.mp4", "./docs-v2.mp4"],
   *   3
   * );
   * ```
   */
  public async searchMultiple(
    query: string,
    videoPaths: string[],
    matchCountPerVideo: number = 5
  ): Promise<SearchResult[]> {
    const allResults: SearchResult[] = [];

    for (const videoPath of videoPaths) {
      if (!fs.existsSync(videoPath)) {
        if (this.verbose) {
          console.warn(`[QRVideoStoreRetriever] Video not found: ${videoPath}`);
        }
        continue;
      }

      const results = await this.search(query, videoPath, matchCountPerVideo);
      allResults.push(...results);
    }

    // Sort by similarity
    allResults.sort((a, b) => b.similarity - a.similarity);

    return allResults;
  }

  /**
   * Retrieve a specific frame by document ID and frame number
   * 
   * @param videoPath Path to the video file
   * @param documentId Document identifier
   * @param frameNumber Frame number
   * @returns Decoded text or null
   */
  public async getFrameByNumber(
    videoPath: string,
    frameNumber: number
  ): Promise<string | null> {
    const cacheKey = `${videoPath}:${frameNumber}`;
    
    // Check cache
    const cached = this.frameCache.get(cacheKey);
    if (cached) {
      return cached;
    }

    // Extract and decode
    const frameBuffer = await this.extractFrameAsBuffer(videoPath, frameNumber);
    if (!frameBuffer) {
      return null;
    }

    const decodedText = await this.decodeQrCodeFromBuffer(frameBuffer);
    if (decodedText) {
      this.addToCache(cacheKey, decodedText);
    }

    return decodedText;
  }

  /**
   * Clear the frame cache
   */
  public clearCache(): void {
    this.frameCache.clear();
    if (this.verbose) {
      console.log('[QRVideoStoreRetriever] Cache cleared');
    }
  }

  /**
   * Get cache statistics
   */
  public getCacheStats(): { size: number; maxSize: number; hitRate?: number } {
    return {
      size: this.frameCache.size,
      maxSize: this.maxCacheSize,
    };
  }

  /**
   * Add item to cache with LRU eviction
   */
  private addToCache(key: string, value: string): void {
    // Simple LRU: if cache is full, remove oldest entry
    if (this.frameCache.size >= this.maxCacheSize) {
      const firstKey = this.frameCache.keys().next().value;
      if (firstKey) {
        this.frameCache.delete(firstKey);
      }
    }

    this.frameCache.set(key, value);
  }

  /**
   * Batch decode multiple frames from a video
   * 
   * @param videoPath Path to video file
   * @param frameNumbers Array of frame numbers to decode
   * @returns Map of frame number to decoded text
   */
  public async batchDecodeFrames(
    videoPath: string,
    frameNumbers: number[]
  ): Promise<Map<number, string>> {
    const results = new Map<number, string>();

    if (this.verbose) {
      console.log(`[QRVideoStoreRetriever] Batch decoding ${frameNumbers.length} frames`);
    }

    for (const frameNumber of frameNumbers) {
      const text = await this.getFrameByNumber(videoPath, frameNumber);
      if (text) {
        results.set(frameNumber, text);
      }
    }

    return results;
  }
}

