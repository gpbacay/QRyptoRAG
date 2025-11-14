# API Reference

Complete API documentation for qr-video-rag.

## Table of Contents

- [QRVideoStoreEncoder](#qrvideostoreencoder)
- [QRVideoStoreRetriever](#qrvideostoreretriever)
- [Database Adapters](#database-adapters)
- [Embedder Adapters](#embedder-adapters)
- [Type Definitions](#type-definitions)

---

## QRVideoStoreEncoder

Encodes text documents into QR-encoded MP4 videos.

### Constructor

```typescript
new QRVideoStoreEncoder(
  database: VectorDatabase,
  embedder: Embedder,
  config?: QRVideoStoreConfig
)
```

**Parameters:**
- `database` - Vector database instance for storing embeddings
- `embedder` - Embedder instance for generating vector embeddings
- `config` - Optional configuration object

**Config Options:**
```typescript
interface QRVideoStoreConfig {
  chunkSize?: number;              // Default: 500
  chunkOverlap?: number;           // Default: 50
  videoFps?: number;               // Default: 1
  qrErrorCorrectionLevel?: 'L' | 'M' | 'Q' | 'H';  // Default: 'M'
  videoResolution?: { width: number; height: number };  // Default: 256x256
  verbose?: boolean;               // Default: false
}
```

### Methods

#### `addDocument(documentId, documentText, outputVideoPath, metadata?)`

Encode a document into a QR video.

```typescript
async addDocument(
  documentId: string,
  documentText: string,
  outputVideoPath: string,
  metadata?: Record<string, any>
): Promise<void>
```

**Example:**
```typescript
await encoder.addDocument(
  'user-guide',
  fileContent,
  './videos/guide.mp4',
  { version: '1.0', author: 'John Doe' }
);
```

#### `addDocumentsBatch(documents)`

Encode multiple documents in batch.

```typescript
async addDocumentsBatch(
  documents: Array<{
    documentId: string;
    documentText: string;
    outputVideoPath: string;
    metadata?: Record<string, any>;
  }>
): Promise<void>
```

#### `chunkText(text)`

Split text into chunks with overlap.

```typescript
chunkText(text: string): Chunk[]
```

**Returns:** Array of chunks with metadata

#### `generateQrCode(text)`

Generate QR code image buffer.

```typescript
async generateQrCode(text: string): Promise<Buffer>
```

#### `buildVideo(qrCodeBuffers, outputVideoPath, options?)`

Build MP4 video from QR code images.

```typescript
async buildVideo(
  qrCodeBuffers: Buffer[],
  outputVideoPath: string,
  options?: Partial<VideoBuildOptions>
): Promise<void>
```

#### `getStats(videoPath, originalText)`

Get compression statistics.

```typescript
async getStats(
  videoPath: string,
  originalText: string
): Promise<QRVideoStoreStats>
```

**Returns:**
```typescript
interface QRVideoStoreStats {
  totalChunks: number;
  totalFrames: number;
  videoSizeBytes: number;
  originalSizeBytes: number;
  compressionRatio: number;
  durationSeconds: number;
}
```

---

## QRVideoStoreRetriever

Retrieves knowledge from QR-encoded videos using semantic search.

### Constructor

```typescript
new QRVideoStoreRetriever(
  database: VectorDatabase,
  embedder: Embedder,
  options?: {
    verbose?: boolean;
    maxCacheSize?: number;
  }
)
```

**Parameters:**
- `database` - Vector database instance
- `embedder` - Embedder instance
- `options` - Optional configuration
  - `verbose` - Enable logging (default: false)
  - `maxCacheSize` - Frame cache size (default: 50)

### Methods

#### `search(query, videoPath, matchCount?)`

Main search method - performs semantic search and decodes results.

```typescript
async search(
  query: string,
  videoPath: string,
  matchCount?: number
): Promise<SearchResult[]>
```

**Returns:**
```typescript
interface SearchResult {
  text: string;
  similarity: number;
  frameNumber: number;
  documentId: string;
  metadata?: Record<string, any>;
}
```

**Example:**
```typescript
const results = await retriever.search(
  'How to configure webhooks?',
  './docs.mp4',
  5
);
```

#### `searchMultiple(query, videoPaths, matchCountPerVideo?)`

Search across multiple videos.

```typescript
async searchMultiple(
  query: string,
  videoPaths: string[],
  matchCountPerVideo?: number
): Promise<SearchResult[]>
```

#### `retrieveChunks(query, matchCount?)`

Get matching chunk metadata without decoding.

```typescript
async retrieveChunks(
  query: string,
  matchCount?: number
): Promise<QRVideoStoreIndexEntry[]>
```

#### `extractFrameAsBuffer(videoPath, frameNumber, options?)`

Extract a specific frame as image buffer.

```typescript
async extractFrameAsBuffer(
  videoPath: string,
  frameNumber: number,
  options?: Partial<FrameExtractionOptions>
): Promise<Buffer | null>
```

#### `decodeQrCodeFromBuffer(imageBuffer)`

Decode QR code from image buffer.

```typescript
async decodeQrCodeFromBuffer(
  imageBuffer: Buffer
): Promise<string | null>
```

#### `getFrameByNumber(videoPath, frameNumber)`

Get decoded text for a specific frame.

```typescript
async getFrameByNumber(
  videoPath: string,
  frameNumber: number
): Promise<string | null>
```

#### `batchDecodeFrames(videoPath, frameNumbers)`

Decode multiple frames in batch.

```typescript
async batchDecodeFrames(
  videoPath: string,
  frameNumbers: number[]
): Promise<Map<number, string>>
```

#### `clearCache()`

Clear the frame cache.

```typescript
clearCache(): void
```

#### `getCacheStats()`

Get cache statistics.

```typescript
getCacheStats(): { size: number; maxSize: number }
```

---

## Database Adapters

### createSupabaseAdapter

```typescript
createSupabaseAdapter(
  client: SupabaseClient,
  tableName?: string,
  rpcFunctionName?: string
): VectorDatabase
```

**Required Supabase Setup:**

1. Create table:
```sql
CREATE TABLE qr_video_store_index (
  id BIGSERIAL PRIMARY KEY,
  chunk_text TEXT NOT NULL,
  embedding VECTOR(1536),
  frame_number INTEGER NOT NULL,
  document_id TEXT NOT NULL,
  chunk_index INTEGER,
  metadata JSONB,
  created_at TIMESTAMP DEFAULT NOW()
);
```

2. Create RPC function:
```sql
CREATE FUNCTION match_qr_video_store_chunks(
  query_embedding VECTOR(1536),
  match_count INT DEFAULT 5
)
RETURNS TABLE (
  chunk_text TEXT,
  embedding VECTOR(1536),
  frame_number INTEGER,
  document_id TEXT,
  similarity FLOAT
)
LANGUAGE SQL
AS $$
  SELECT
    chunk_text,
    embedding,
    frame_number,
    document_id,
    1 - (embedding <=> query_embedding) AS similarity
  FROM qr_video_store_index
  ORDER BY embedding <=> query_embedding
  LIMIT match_count;
$$;
```

### createInMemoryAdapter

```typescript
createInMemoryAdapter(
  initialData?: QRVideoStoreIndexEntry[]
): VectorDatabase
```

Simple in-memory storage using cosine similarity.

### createFileAdapter

```typescript
createFileAdapter(filePath: string): VectorDatabase
```

JSON file-based storage with persistence.

### createCustomAdapter

```typescript
createCustomAdapter(
  implementation: VectorDatabase
): VectorDatabase
```

Wrap your custom database implementation.

---

## Embedder Adapters

### createGeminiEmbedder (Primary - Recommended)

```typescript
createGeminiEmbedder(
  apiKey: string,
  model?: string
): Embedder
```

**Model:**
- `text-embedding-004` (default) - 768 dimensions

**Example:**
```typescript
const embedder = createGeminiEmbedder(
  process.env.GEMINI_API_KEY!,
  'text-embedding-004'
);
```

### createGoogleAIEmbedder

```typescript
createGoogleAIEmbedder(
  apiKey: string,
  model?: string
): Embedder
```

**Default model:** `text-embedding-004` (768 dimensions)

### createCohereEmbedder

```typescript
createCohereEmbedder(
  apiKey: string,
  model?: string,
  inputType?: 'search_document' | 'search_query' | 'classification' | 'clustering'
): Embedder
```

### createHuggingFaceEmbedder

```typescript
createHuggingFaceEmbedder(
  apiKey: string,
  model?: string
): Embedder
```

### createMockEmbedder

```typescript
createMockEmbedder(dimension?: number): Embedder
```

For testing purposes only.

### createCustomEmbedder

```typescript
createCustomEmbedder(
  embedFn: (text: string) => Promise<number[]>,
  dimension?: number
): Embedder
```

### createCachedEmbedder

```typescript
createCachedEmbedder(
  embedder: Embedder,
  maxCacheSize?: number
): Embedder
```

Wraps any embedder with LRU caching.

---

## Type Definitions

### VectorDatabase

```typescript
interface VectorDatabase {
  upsert(entries: QRVideoStoreIndexEntry[]): Promise<void>;
  search(embedding: number[], limit: number): Promise<QRVideoStoreIndexEntry[]>;
  delete?(documentId: string): Promise<void>;
  clear?(): Promise<void>;
}
```

### Embedder

```typescript
interface Embedder {
  embed(text: string): Promise<number[]>;
  dimension?(): number;
}
```

### QRVideoStoreIndexEntry

```typescript
interface QRVideoStoreIndexEntry {
  chunkText: string;
  embedding: number[];
  frameNumber: number;
  documentId: string;
  similarity?: number;
  metadata?: Record<string, any>;
}
```

### Chunk

```typescript
interface Chunk {
  text: string;
  index: number;
  metadata?: Record<string, any>;
}
```

---

## Error Handling

All methods may throw errors. Wrap calls in try-catch:

```typescript
try {
  await encoder.addDocument('doc', text, './output.mp4');
} catch (error) {
  console.error('Encoding failed:', error.message);
}
```

## Performance Tips

1. **Use appropriate chunk sizes** - Larger chunks = fewer frames = faster
2. **Enable caching** - Retriever caches decoded frames
3. **Batch operations** - Use `addDocumentsBatch()` when possible
4. **Choose the right embedder** - Consider speed vs accuracy tradeoffs
5. **Adjust video FPS** - Default 1 FPS is optimal for most cases

## Best Practices

1. **Persistent storage** - Use Supabase or file adapter for production
2. **Error correction** - Use 'M' or 'Q' for QR error correction level
3. **Metadata** - Add metadata to chunks for better organization
4. **Versioning** - Include version info in document IDs or metadata
5. **Testing** - Use mock embedder for unit tests

---

For more examples, see the [examples/](../examples/) directory.

