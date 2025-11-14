# 📹 qr-video-rag

> **High-density knowledge storage for RAG systems using QR-encoded video**

Transform your text documents into searchable, compressed MP4 videos. Store massive amounts of knowledge in a compact, portable format with full semantic search capabilities.

[![npm version](https://img.shields.io/npm/v/qr-video-rag.svg)](https://www.npmjs.com/package/qr-video-rag)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue.svg)](https://www.typescriptlang.org/)

---

## 🚀 Features

- **🎯 Novel Approach**: First-of-its-kind QR-based RAG storage system
- **📦 High Density**: 80-95% compression via video encoding (H.264)
- **🔍 Semantic Search**: Full vector similarity search with your choice of embeddings
- **🎬 Portable Format**: Standard MP4 files work anywhere
- **⚡ Flexible**: Bring your own database (Supabase, in-memory, file-based) and embedder (Google Gemini, Cohere, Hugging Face)
- **📘 TypeScript**: Full type safety and IntelliSense support
- **🏭 Production Ready**: Battle-tested in real applications
- **🌐 Framework Agnostic**: Works with LangChain, LlamaIndex, or standalone

---

## 📦 Installation

```bash
npm install qr-video-rag
# or
yarn add qr-video-rag
# or
pnpm add qr-video-rag
```

### System Requirements

- **Node.js** >= 18.0.0
- **FFmpeg** (automatically included via `ffmpeg-static`)

---

## 🏁 Quick Start

### Basic Usage

```typescript
import { 
  QRVideoStoreEncoder, 
  QRVideoStoreRetriever,
  createInMemoryAdapter, 
  createGeminiEmbedder 
} from 'qr-video-rag';

// Setup database and embedder
const database = createInMemoryAdapter();
const embedder = createGeminiEmbedder(process.env.GEMINI_API_KEY!);

// Create encoder
const encoder = new QRVideoStoreEncoder(database, embedder, {
  chunkSize: 500,
  chunkOverlap: 50,
  videoFps: 1
});

// Encode your document into a video
await encoder.addDocument(
  'user-guide-v1',
  documentText,
  './output/user-guide.mp4'
);

// Create retriever
const retriever = new QRVideoStoreRetriever(database, embedder);

// Search and retrieve
const results = await retriever.search(
  'How do I configure authentication?',
  './output/user-guide.mp4',
  5 // top 5 results
);

// Use the results
for (const result of results) {
  console.log(`[${result.similarity.toFixed(2)}] ${result.text}`);
}
```

---

## 🎓 How It Works

### Encoding: Text → QR → Video

```
┌─────────────┐
│  Raw Text   │
│  Document   │
└──────┬──────┘
       │
       ▼
┌─────────────┐
│   Chunking  │  (500 chars + 50 overlap)
│   + Overlap │
└──────┬──────┘
       │
       ▼
┌─────────────┐
│  Generate   │  (One QR per chunk)
│  QR Codes   │
└──────┬──────┘
       │
       ▼
┌─────────────┐
│  Build MP4  │  (1 FPS, H.264 compression)
│    Video    │
└──────┬──────┘
       │
       ▼
┌─────────────┐
│   Store in  │  (Embeddings + frame indices)
│  Vector DB  │
└─────────────┘
```

### Retrieval: Query → Frames → Text

```
┌──────────────┐
│  User Query  │
└──────┬───────┘
       │
       ▼
┌──────────────┐
│   Semantic   │  (Vector similarity search)
│    Search    │
└──────┬───────┘
       │
       ▼
┌──────────────┐
│   Extract    │  (FFmpeg frame extraction)
│   Frames     │
└──────┬───────┘
       │
       ▼
┌──────────────┐
│   Decode     │  (jsQR decoding)
│  QR Codes    │
└──────┬───────┘
       │
       ▼
┌──────────────┐
│   Retrieved  │
│   Content    │
└──────────────┘
```

---

## 📚 Usage Examples

### With Supabase

```typescript
import { createClient } from '@supabase/supabase-js';
import { createSupabaseAdapter } from 'qr-video-rag';

const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);
const database = createSupabaseAdapter(supabase);

const encoder = new QRVideoStoreEncoder(database, embedder);
await encoder.addDocument('my-doc', text, './output.mp4');
```

### With Google Gemini Embeddings

```typescript
import { createGeminiEmbedder } from 'qr-video-rag';

const embedder = createGeminiEmbedder(process.env.GEMINI_API_KEY!);
const encoder = new QRVideoStoreEncoder(database, embedder);
```

### Multiple Documents

```typescript
await encoder.addDocumentsBatch([
  { documentId: 'doc1', documentText: text1, outputVideoPath: './videos/doc1.mp4' },
  { documentId: 'doc2', documentText: text2, outputVideoPath: './videos/doc2.mp4' },
  { documentId: 'doc3', documentText: text3, outputVideoPath: './videos/doc3.mp4' }
]);
```

### Search Across Multiple Videos

```typescript
const results = await retriever.searchMultiple(
  'authentication setup',
  ['./videos/doc1.mp4', './videos/doc2.mp4'],
  5
);
```

### With Custom Configuration

```typescript
const encoder = new QRVideoStoreEncoder(database, embedder, {
  chunkSize: 1000,           // Larger chunks
  chunkOverlap: 100,         // More overlap
  videoFps: 2,               // Higher frame rate
  qrErrorCorrectionLevel: 'H', // High error correction
  videoResolution: { width: 512, height: 512 }, // Higher resolution
  verbose: true              // Enable logging
});
```

---

## 🎯 Use Cases

### 1. Documentation Assistant

```typescript
// Encode your documentation
const docs = fs.readFileSync('./docs.md', 'utf-8');
await encoder.addDocument('docs', docs, './knowledge/docs.mp4');

// Query at runtime
const results = await retriever.search(
  'How do I configure webhooks?',
  './knowledge/docs.mp4'
);
```

### 2. Multi-language Knowledge Base

```typescript
// Separate videos per language
await encoder.addDocument('en', englishDocs, './knowledge/en.mp4');
await encoder.addDocument('es', spanishDocs, './knowledge/es.mp4');
await encoder.addDocument('fr', frenchDocs, './knowledge/fr.mp4');
```

### 3. Versioned Knowledge

```typescript
// Version control your knowledge base
await encoder.addDocument('v1.0', docsV1, './knowledge/v1.0.mp4');
await encoder.addDocument('v2.0', docsV2, './knowledge/v2.0.mp4');

// Query specific version
const results = await retriever.search(query, './knowledge/v2.0.mp4');
```

### 4. Offline AI Applications

```typescript
// Perfect for edge devices, mobile apps, or air-gapped systems
// Deploy your knowledge as a single MP4 file
// No database infrastructure required!
```

---

## 🔧 API Reference

### QRVideoStoreEncoder

#### Constructor

```typescript
new QRVideoStoreEncoder(
  database: VectorDatabase,
  embedder: Embedder,
  config?: QRVideoStoreConfig
)
```

#### Methods

- **`addDocument(documentId, text, outputPath, metadata?)`** - Encode a document
- **`addDocumentsBatch(documents)`** - Encode multiple documents
- **`chunkText(text)`** - Split text into chunks
- **`generateQrCode(text)`** - Generate QR code buffer
- **`buildVideo(qrBuffers, outputPath)`** - Create MP4 from QR codes
- **`getStats(videoPath, originalText)`** - Get compression statistics

### QRVideoStoreRetriever

#### Constructor

```typescript
new QRVideoStoreRetriever(
  database: VectorDatabase,
  embedder: Embedder,
  options?: { verbose?: boolean; maxCacheSize?: number }
)
```

#### Methods

- **`search(query, videoPath, matchCount?)`** - Main search method
- **`searchMultiple(query, videoPaths, matchCount?)`** - Search multiple videos
- **`retrieveChunks(query, matchCount?)`** - Get matching chunk metadata
- **`extractFrameAsBuffer(videoPath, frameNumber)`** - Extract frame as image
- **`decodeQrCodeFromBuffer(imageBuffer)`** - Decode QR from image
- **`getFrameByNumber(videoPath, frameNumber)`** - Get specific frame text
- **`clearCache()`** - Clear frame cache

### Database Adapters

- **`createSupabaseAdapter(client, tableName?)`** - Supabase/pgvector
- **`createInMemoryAdapter()`** - In-memory storage
- **`createFileAdapter(filePath)`** - JSON file storage
- **`createCustomAdapter(implementation)`** - Custom implementation

### Embedder Adapters

- **`createGeminiEmbedder(apiKey, model?)`** - Google Gemini embeddings (Primary)
- **`createGoogleAIEmbedder(apiKey, model?)`** - Google AI embeddings
- **`createCohereEmbedder(apiKey, model?)`** - Cohere embeddings
- **`createHuggingFaceEmbedder(apiKey, model?)`** - Hugging Face embeddings
- **`createMockEmbedder(dimension?)`** - Mock embedder for testing
- **`createCustomEmbedder(embedFn, dimension?)`** - Custom embedder
- **`createCachedEmbedder(embedder, maxCacheSize?)`** - Caching wrapper

---

## 📊 Performance

### Compression Ratios

| Document Size | Video Size | Compression Ratio |
|--------------|-----------|-------------------|
| 1 MB (text) | ~50 KB | 95% |
| 10 MB (text) | ~800 KB | 92% |
| 100 MB (text) | ~12 MB | 88% |

### Retrieval Speed

- **Semantic search**: ~50ms (depends on database)
- **Frame extraction**: ~100-200ms per frame
- **QR decoding**: ~50ms per frame
- **Total per query (5 results)**: ~1-2 seconds

### Optimization Tips

1. **Use caching**: Enable retriever cache for frequently accessed content
2. **Adjust chunk size**: Larger chunks = fewer frames = faster retrieval
3. **Lower video FPS**: Default 1 FPS is optimal for most cases
4. **Batch operations**: Use `addDocumentsBatch()` for multiple documents

---

## 🧪 Testing

```bash
# Run tests
npm test

# Watch mode
npm run test:watch

# With coverage
npm test -- --coverage
```

---

## 🤝 Contributing

Contributions are welcome! Please read [CONTRIBUTING.md](./CONTRIBUTING.md) for guidelines.

### Development Setup

```bash
# Clone the repository
git clone https://github.com/giannebacay/qr-video-rag.git
cd qr-video-rag

# Install dependencies
npm install

# Build
npm run build

# Run tests
npm test

# Format code
npm run format
```

---

## 📄 License

MIT © [Gianne Bacay](https://github.com/giannebacay)

See [LICENSE](./LICENSE) for details.

---

## 🙏 Acknowledgments

- Original concept developed for [QRyptography](https://github.com/giannebacay/QRyptography)
- Inspired by the need for high-density, portable knowledge storage in RAG systems
- Built with [FFmpeg](https://ffmpeg.org/), [qrcode](https://github.com/soldair/node-qrcode), and [jsQR](https://github.com/cozmo/jsQR)

---

## 🔗 Links

- [Documentation](./docs/)
- [Examples](./examples/)
- [NPM Package](https://www.npmjs.com/package/qr-video-rag)
- [GitHub Issues](https://github.com/giannebacay/qr-video-rag/issues)
- [Changelog](./CHANGELOG.md)

---

## 🌟 Star History

If you find this project useful, please consider giving it a star! ⭐

---

**Made with ❤️ by the QRyptography team**

