/**
 * Basic Usage Example
 * 
 * This example demonstrates the core functionality of qr-video-rag
 */

import {
  QRVideoStoreEncoder,
  QRVideoStoreRetriever,
  createInMemoryAdapter,
  createSimpleEmbedder,
} from '../src';

async function main() {
  console.log('🚀 QR Video RAG - Basic Usage Example\n');

  // Step 1: Setup
  console.log('1️⃣ Setting up database and embedder...');
  const database = createInMemoryAdapter();
  const embedder = createSimpleEmbedder(384); // Simple embedder for demo

  // Step 2: Create encoder
  console.log('2️⃣ Creating encoder...');
  const encoder = new QRVideoStoreEncoder(database, embedder, {
    chunkSize: 200,
    chunkOverlap: 20,
    videoFps: 1,
    verbose: true,
  });

  // Step 3: Prepare sample document
  const sampleDocument = `
    Welcome to QR Video RAG!
    
    This is a revolutionary approach to knowledge storage for RAG systems.
    By encoding text as QR codes within video frames, we achieve incredible
    compression ratios while maintaining full semantic search capabilities.
    
    Key features include:
    - High-density storage (80-95% compression)
    - Portable MP4 format
    - Semantic search with vector embeddings
    - Framework agnostic design
    
    Perfect for documentation, knowledge bases, and offline AI applications.
  `.trim();

  // Step 4: Encode document
  console.log('\n3️⃣ Encoding document into video...');
  const videoPath = './example-output/basic-demo.mp4';
  
  await encoder.addDocument(
    'demo-doc',
    sampleDocument,
    videoPath,
    { author: 'Demo User', version: '1.0' }
  );

  // Step 5: Get stats
  console.log('\n4️⃣ Getting video statistics...');
  const stats = await encoder.getStats(videoPath, sampleDocument);
  console.log(`
  📊 Statistics:
  - Total chunks: ${stats.totalChunks}
  - Total frames: ${stats.totalFrames}
  - Video size: ${(stats.videoSizeBytes / 1024).toFixed(2)} KB
  - Original size: ${(stats.originalSizeBytes / 1024).toFixed(2)} KB
  - Compression: ${(stats.compressionRatio * 100).toFixed(1)}%
  - Duration: ${stats.durationSeconds.toFixed(1)}s
  `);

  // Step 6: Create retriever
  console.log('5️⃣ Creating retriever...');
  const retriever = new QRVideoStoreRetriever(database, embedder, {
    verbose: true,
    maxCacheSize: 10,
  });

  // Step 7: Search
  console.log('\n6️⃣ Performing search...');
  const query = 'What are the key features?';
  const results = await retriever.search(query, videoPath, 3);

  console.log(`\n🔍 Search Results for: "${query}"\n`);
  for (let i = 0; i < results.length; i++) {
    const result = results[i];
    console.log(`Result ${i + 1} (similarity: ${result.similarity.toFixed(2)}):`);
    console.log(`${result.text}\n`);
  }

  console.log('✅ Demo complete!');
}

// Run the example
main().catch(console.error);

