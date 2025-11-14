/**
 * QR Video RAG - Encoder
 * 
 * Encodes text documents into QR-encoded video format
 */

import * as QRCode from 'qrcode';
import ffmpeg from 'fluent-ffmpeg';
import ffmpegStatic from 'ffmpeg-static';
import * as fs from 'fs';
import * as path from 'path';
import {
  QRVideoStoreConfig,
  Chunk,
  QRVideoStoreIndexEntry,
  VectorDatabase,
  Embedder,
  VideoBuildOptions,
  QRVideoStoreStats,
} from './types';

// Set ffmpeg path
if (ffmpegStatic) {
  ffmpeg.setFfmpegPath(ffmpegStatic);
}

/**
 * QR Video Store Encoder
 * 
 * Converts text documents into QR-encoded MP4 videos with semantic indexing
 */
export class QRVideoStoreEncoder {
  private config: Required<Omit<QRVideoStoreConfig, 'verbose'>> & { verbose: boolean };
  private database: VectorDatabase;
  private embedder: Embedder;

  /**
   * Create a new QR Video Store Encoder
   * 
   * @param database Vector database for storing chunk embeddings
   * @param embedder Embedding generator for semantic search
   * @param config Configuration options
   * 
   * @example
 * ```typescript
 * const encoder = new QRVideoStoreEncoder(
 *   createInMemoryAdapter(),
 *   createGeminiEmbedder(apiKey),
 *   { chunkSize: 500, videoFps: 1 }
 * );
 * ```
   */
  constructor(
    database: VectorDatabase,
    embedder: Embedder,
    config: QRVideoStoreConfig = {}
  ) {
    this.database = database;
    this.embedder = embedder;
    this.config = {
      chunkSize: config.chunkSize ?? 500,
      chunkOverlap: config.chunkOverlap ?? 50,
      videoFps: config.videoFps ?? 1,
      qrErrorCorrectionLevel: config.qrErrorCorrectionLevel ?? 'M',
      videoResolution: config.videoResolution ?? { width: 256, height: 256 },
      verbose: config.verbose ?? false,
    };
  }

  /**
   * Chunk text into smaller pieces with overlap
   * 
   * @param text Input text to chunk
   * @returns Array of text chunks with indices
   * 
   * @example
   * ```typescript
   * const chunks = encoder.chunkText("Long document text...");
   * console.log(chunks.length); // Number of chunks created
   * ```
   */
  public chunkText(text: string): Chunk[] {
    const chunks: Chunk[] = [];
    let i = 0;

    while (i < text.length) {
      const end = Math.min(i + this.config.chunkSize, text.length);
      const chunkText = text.substring(i, end);
      chunks.push({ 
        text: chunkText, 
        index: chunks.length,
        metadata: {
          startPosition: i,
          endPosition: end,
        }
      });
      i += this.config.chunkSize - this.config.chunkOverlap;
    }

    if (this.config.verbose) {
      console.log(`[QRVideoStoreEncoder] Created ${chunks.length} chunks from ${text.length} characters`);
    }

    return chunks;
  }

  /**
   * Generate QR code image buffer from text
   * 
   * @param text Text to encode as QR code
   * @returns Buffer containing PNG image data
   * 
   * @example
   * ```typescript
   * const qrBuffer = await encoder.generateQrCode("Hello World");
   * fs.writeFileSync("qr.png", qrBuffer);
   * ```
   */
  public async generateQrCode(text: string): Promise<Buffer> {
    return QRCode.toBuffer(text, {
      type: 'png',
      errorCorrectionLevel: this.config.qrErrorCorrectionLevel,
      width: this.config.videoResolution.width,
      margin: 1,
    });
  }

  /**
   * Build MP4 video from QR code images
   * 
   * @param qrCodeBuffers Array of QR code image buffers
   * @param outputVideoPath Path where video will be saved
   * @returns Promise that resolves when video is created
   * 
   * @example
   * ```typescript
   * const qrBuffers = await Promise.all(
   *   chunks.map(c => encoder.generateQrCode(c.text))
   * );
   * await encoder.buildVideo(qrBuffers, "./output.mp4");
   * ```
   */
  public async buildVideo(
    qrCodeBuffers: Buffer[],
    outputVideoPath: string,
    options?: Partial<VideoBuildOptions>
  ): Promise<void> {
    const tempDir = path.join(process.cwd(), `temp_qr_frames_${Date.now()}`);
    
    try {
      // Create temp directory
      if (!fs.existsSync(tempDir)) {
        fs.mkdirSync(tempDir, { recursive: true });
      }

      if (this.config.verbose) {
        console.log(`[QRVideoStoreEncoder] Writing ${qrCodeBuffers.length} frames to ${tempDir}`);
      }

      // Write images to temp directory
      for (let i = 0; i < qrCodeBuffers.length; i++) {
        const imagePath = path.join(tempDir, `frame_${i.toString().padStart(5, '0')}.png`);
        fs.writeFileSync(imagePath, qrCodeBuffers[i]);
      }

      // Ensure output directory exists
      const outputDir = path.dirname(outputVideoPath);
      if (!fs.existsSync(outputDir)) {
        fs.mkdirSync(outputDir, { recursive: true });
      }

      // Build video with FFmpeg
      await this.encodeVideo(tempDir, outputVideoPath, options);

      if (this.config.verbose) {
        console.log(`[QRVideoStoreEncoder] Video created: ${outputVideoPath}`);
      }
    } finally {
      // Cleanup temp directory
      if (fs.existsSync(tempDir)) {
        await fs.promises.rm(tempDir, { recursive: true, force: true });
      }
    }
  }

  /**
   * Internal method to encode video using FFmpeg
   */
  private async encodeVideo(
    tempDir: string,
    outputVideoPath: string,
    options?: Partial<VideoBuildOptions>
  ): Promise<void> {
    return new Promise((resolve, reject) => {
      const { width, height } = this.config.videoResolution;
      const codec = options?.codec ?? 'libx264';
      const pixelFormat = options?.pixelFormat ?? 'yuv420p';
      
      const command = ffmpeg()
        .input(path.join(tempDir, 'frame_%05d.png'))
        .inputFPS(this.config.videoFps)
        .outputOptions([
          `-c:v ${codec}`,
          `-pix_fmt ${pixelFormat}`,
          `-r ${this.config.videoFps}`,
          `-vf scale=${width}:${height}:force_original_aspect_ratio=decrease,pad=${width}:${height}:(ow-iw)/2:(oh-ih)/2`,
          ...(options?.ffmpegOptions ?? [])
        ])
        .output(outputVideoPath)
        .on('end', () => resolve())
        .on('error', (err) => reject(new Error(`FFmpeg error: ${err.message}`)));

      if (this.config.verbose) {
        command.on('progress', (progress) => {
          console.log(`[QRVideoStoreEncoder] Encoding: ${progress.percent?.toFixed(1) ?? 0}%`);
        });
      }

      command.run();
    });
  }

  /**
   * Add a document to the QR Video Store
   * 
   * This is the main method that orchestrates the entire encoding process:
   * 1. Chunks the document text
   * 2. Generates QR codes for each chunk
   * 3. Creates embeddings for semantic search
   * 4. Builds the MP4 video
   * 5. Stores the index in the vector database
   * 
   * @param documentId Unique identifier for the document
   * @param documentText Full text content of the document
   * @param outputVideoPath Path where the video will be saved
   * @param metadata Optional metadata to attach to chunks
   * @returns Promise that resolves when document is fully processed
   * 
   * @example
   * ```typescript
   * await encoder.addDocument(
   *   "user-guide-v1",
   *   fileContent,
   *   "./videos/user-guide.mp4",
   *   { author: "John Doe", version: "1.0" }
   * );
   * ```
   */
  public async addDocument(
    documentId: string,
    documentText: string,
    outputVideoPath: string,
    metadata?: Record<string, any>
  ): Promise<void> {
    console.log(`[QRVideoStoreEncoder] Processing document: ${documentId}`);
    const startTime = Date.now();

    // Step 1: Chunk the text
    const chunks = this.chunkText(documentText);
    console.log(`[QRVideoStoreEncoder] Created ${chunks.length} chunks`);

    // Step 2 & 3: Generate QR codes and embeddings in parallel
    const qrCodeBuffers: Buffer[] = [];
    const indexEntries: QRVideoStoreIndexEntry[] = [];

    for (let i = 0; i < chunks.length; i++) {
      const chunk = chunks[i];
      
      if (this.config.verbose && i % 10 === 0) {
        console.log(`[QRVideoStoreEncoder] Processing chunk ${i + 1}/${chunks.length}`);
      }

      // Generate QR code and embedding in parallel
      const [qrCodeBuffer, embedding] = await Promise.all([
        this.generateQrCode(chunk.text),
        this.embedder.embed(chunk.text)
      ]);

      qrCodeBuffers.push(qrCodeBuffer);
      indexEntries.push({
        chunkText: chunk.text,
        embedding,
        frameNumber: chunk.index,
        documentId,
        metadata: { ...chunk.metadata, ...metadata }
      });
    }

    // Step 4: Build video
    console.log(`[QRVideoStoreEncoder] Building video...`);
    await this.buildVideo(qrCodeBuffers, outputVideoPath);

    // Step 5: Store index
    console.log(`[QRVideoStoreEncoder] Storing index in database...`);
    await this.database.upsert(indexEntries);

    const duration = ((Date.now() - startTime) / 1000).toFixed(2);
    console.log(`[QRVideoStoreEncoder] ✅ Document "${documentId}" processed in ${duration}s`);
  }

  /**
   * Add multiple documents in batch
   * 
   * @param documents Array of documents to add
   * @returns Promise that resolves when all documents are processed
   * 
   * @example
   * ```typescript
   * await encoder.addDocumentsBatch([
   *   { id: "doc1", text: "...", output: "./videos/doc1.mp4" },
   *   { id: "doc2", text: "...", output: "./videos/doc2.mp4" }
   * ]);
   * ```
   */
  public async addDocumentsBatch(
    documents: Array<{
      documentId: string;
      documentText: string;
      outputVideoPath: string;
      metadata?: Record<string, any>;
    }>
  ): Promise<void> {
    console.log(`[QRVideoStoreEncoder] Processing ${documents.length} documents in batch`);
    
    for (const doc of documents) {
      await this.addDocument(
        doc.documentId,
        doc.documentText,
        doc.outputVideoPath,
        doc.metadata
      );
    }

    console.log(`[QRVideoStoreEncoder] ✅ Batch processing complete`);
  }

  /**
   * Get statistics about a video file
   * 
   * @param videoPath Path to the video file
   * @param originalText Original text content (for compression ratio)
   * @returns Statistics about the video store
   */
  public async getStats(
    videoPath: string,
    originalText: string
  ): Promise<QRVideoStoreStats> {
    const videoStats = fs.statSync(videoPath);
    const videoSizeBytes = videoStats.size;
    const originalSizeBytes = Buffer.byteLength(originalText, 'utf8');
    
    // Get video duration and frame count
    const videoInfo = await this.getVideoInfo(videoPath);

    return {
      totalChunks: this.chunkText(originalText).length,
      totalFrames: videoInfo.frames,
      videoSizeBytes,
      originalSizeBytes,
      compressionRatio: 1 - (videoSizeBytes / originalSizeBytes),
      durationSeconds: videoInfo.duration,
    };
  }

  /**
   * Get video metadata using FFmpeg
   */
  private async getVideoInfo(videoPath: string): Promise<{ duration: number; frames: number }> {
    return new Promise((resolve, reject) => {
      ffmpeg.ffprobe(videoPath, (err, metadata) => {
        if (err) {
          reject(err);
          return;
        }
        
        const videoStream = metadata.streams.find(s => s.codec_type === 'video');
        const duration = metadata.format.duration || 0;
        const frames = videoStream?.nb_frames 
          ? parseInt(videoStream.nb_frames.toString())
          : Math.ceil(duration * this.config.videoFps);

        resolve({ duration, frames });
      });
    });
  }
}

