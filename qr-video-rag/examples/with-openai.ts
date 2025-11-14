/**
 * Google Gemini Integration Example
 * 
 * This example shows how to use qr-video-rag with Google Gemini embeddings
 */

import {
  QRVideoStoreEncoder,
  QRVideoStoreRetriever,
  createInMemoryAdapter,
  createGoogleAIEmbedder,
} from '../src';
import * as fs from 'fs';
import * as readline from 'readline';

async function main() {
  console.log('🚀 QR Video RAG - Google Gemini Example\n');

  // Check for API key
  if (!process.env.GOOGLE_GENAI_API_KEY) {
    console.error('❌ Error: GOOGLE_GENAI_API_KEY environment variable is required');
    console.log('Set it with: export GOOGLE_GENAI_API_KEY=your-api-key');
    console.log('Get your API key from: https://aistudio.google.com/app/apikey');
    process.exit(1);
  }

  // Setup
  console.log('Setting up with Google Gemini embeddings...');
  const database = createInMemoryAdapter();
  const embedder = createGoogleAIEmbedder(
    process.env.GOOGLE_GENAI_API_KEY,
    'text-embedding-004'
  );

  const encoder = new QRVideoStoreEncoder(database, embedder, {
    chunkSize: 500,
    chunkOverlap: 50,
    verbose: true,
  });

  // Load a sample document
  const documentPath = process.argv[2] || './README.md';
  
  if (!fs.existsSync(documentPath)) {
    console.error(`❌ Document not found: ${documentPath}`);
    console.log('Usage: npx tsx examples/with-gemini.ts <path-to-document>');
    process.exit(1);
  }

  console.log(`📄 Loading document: ${documentPath}`);
  const documentText = fs.readFileSync(documentPath, 'utf-8');
  console.log(`Document size: ${(documentText.length / 1024).toFixed(2)} KB`);

  // Encode
  const videoPath = './example-output/gemini-demo.mp4';
  console.log(`\n🎬 Encoding to: ${videoPath}`);
  
  await encoder.addDocument(
    'gemini-doc',
    documentText,
    videoPath
  );

  // Get stats
  const stats = await encoder.getStats(videoPath, documentText);
  console.log(`\n📊 Compression: ${(stats.compressionRatio * 100).toFixed(1)}%`);
  console.log(`Video size: ${(stats.videoSizeBytes / 1024).toFixed(2)} KB`);

  // Create retriever
  const retriever = new QRVideoStoreRetriever(database, embedder, {
    verbose: true,
  });

  // Interactive query loop
  console.log('\n💬 Ready for queries! (Type "exit" to quit)\n');
  
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });

  const askQuestion = () => {
    rl.question('Query: ', async (query: string) => {
      if (query.toLowerCase() === 'exit') {
        console.log('👋 Goodbye!');
        rl.close();
        return;
      }

      if (!query.trim()) {
        askQuestion();
        return;
      }

      try {
        const results = await retriever.search(query, videoPath, 3);
        
        console.log(`\n🔍 Found ${results.length} results:\n`);
        results.forEach((result, i) => {
          console.log(`${i + 1}. [${result.similarity.toFixed(2)}]`);
          console.log(`   ${result.text.substring(0, 150)}...\n`);
        });
      } catch (error) {
        console.error('Error:', error);
      }

      askQuestion();
    });
  };

  askQuestion();
}

main().catch(console.error);

