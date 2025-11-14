# Quick Start Guide

Get up and running with qr-video-rag in 5 minutes!

## Installation

```bash
npm install qr-video-rag
```

## Basic Example

Here's a complete example to encode and search a document:

```typescript
import {
  QRVideoStoreEncoder,
  QRVideoStoreRetriever,
  createInMemoryAdapter,
  createMockEmbedder
} from 'qr-video-rag';

// 1. Setup
const database = createInMemoryAdapter();
const embedder = createMockEmbedder(); // Use real embedder in production

// 2. Create encoder
const encoder = new QRVideoStoreEncoder(database, embedder);

// 3. Encode your document
const myDocument = `
  Your long document text here.
  This could be documentation, articles, knowledge base content, etc.
`;

await encoder.addDocument(
  'my-first-doc',
  myDocument,
  './output/my-document.mp4'
);

// 4. Create retriever
const retriever = new QRVideoStoreRetriever(database, embedder);

// 5. Search!
const results = await retriever.search(
  'your search query',
  './output/my-document.mp4',
  5 // number of results
);

// 6. Use results
for (const result of results) {
  console.log(`Similarity: ${result.similarity}`);
  console.log(`Text: ${result.text}\n`);
}
```

## Production Example with Google Gemini

For real applications, use Google Gemini embedder:

```typescript
import { createGeminiEmbedder } from 'qr-video-rag';

const embedder = createGeminiEmbedder(process.env.GEMINI_API_KEY!);
```

Add your API key to `.env.local`:
```bash
GEMINI_API_KEY=your-gemini-api-key
```

## Next Steps

- Check out [examples/](../examples/) for more use cases
- Read the [API Documentation](./API.md)
- Learn about [different adapters](../README.md#-usage-examples)

## Common Patterns

### Encoding Multiple Documents

```typescript
await encoder.addDocumentsBatch([
  { documentId: 'doc1', documentText: text1, outputVideoPath: './videos/doc1.mp4' },
  { documentId: 'doc2', documentText: text2, outputVideoPath: './videos/doc2.mp4' }
]);
```

### Search Multiple Videos

```typescript
const results = await retriever.searchMultiple(
  'query',
  ['./videos/doc1.mp4', './videos/doc2.mp4']
);
```

### Custom Configuration

```typescript
const encoder = new QRVideoStoreEncoder(database, embedder, {
  chunkSize: 1000,
  chunkOverlap: 100,
  videoFps: 2,
  verbose: true
});
```

## Troubleshooting

### "FFmpeg not found" Error

The package includes `ffmpeg-static`, but if you encounter issues:

1. **Linux/Mac**: Install FFmpeg via package manager
   ```bash
   # Ubuntu/Debian
   sudo apt install ffmpeg
   
   # Mac
   brew install ffmpeg
   ```

2. **Windows**: Download from [ffmpeg.org](https://ffmpeg.org/download.html)

### "Out of Memory" Error

Reduce chunk size or process smaller documents:

```typescript
const encoder = new QRVideoStoreEncoder(database, embedder, {
  chunkSize: 300  // Smaller chunks
});
```

### Slow Performance

1. Enable caching in retriever
2. Use in-memory database for testing
3. Reduce match count in searches

## Need Help?

- [Full Documentation](../README.md)
- [API Reference](./API.md)
- [GitHub Issues](https://github.com/gpbacay/qryptorag/issues)

