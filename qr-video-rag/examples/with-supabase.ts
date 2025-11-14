/**
 * Supabase Integration Example
 * 
 * This example shows how to use qr-video-rag with Supabase as the vector database
 */

import { createClient } from '@supabase/supabase-js';
import {
  QRVideoStoreEncoder,
  QRVideoStoreRetriever,
  createSupabaseAdapter,
  createGeminiEmbedder,
} from '../src';
import * as dotenv from 'dotenv';

// Load environment variables from .env.local
dotenv.config({ path: '../.env.local' });

async function main() {
  console.log('🚀 QR Video RAG - Supabase + Gemini Example\n');

  // Check for required environment variables
  const requiredEnvVars = ['SUPABASE_URL', 'SUPABASE_KEY', 'GEMINI_API_KEY'];
  const missing = requiredEnvVars.filter(v => !process.env[v]);
  
  if (missing.length > 0) {
    console.error(`❌ Missing required environment variables: ${missing.join(', ')}`);
    console.log('\nAdd them to your .env.local file:');
    missing.forEach(v => console.log(`${v}=your-value`));
    process.exit(1);
  }

  // Setup Supabase
  console.log('Setting up Supabase client...');
  const supabase = createClient(
    process.env.SUPABASE_URL!,
    process.env.SUPABASE_KEY!
  );

  const database = createSupabaseAdapter(supabase, 'qr_video_store_index');
  const embedder = createGeminiEmbedder(process.env.GEMINI_API_KEY!);

  // Create encoder
  const encoder = new QRVideoStoreEncoder(database, embedder, {
    verbose: true,
  });

  // Sample documents
  const documents = [
    {
      id: 'getting-started',
      text: 'Getting started with our platform is easy. First, create an account...',
      path: './example-output/supabase-doc1.mp4',
    },
    {
      id: 'advanced-features',
      text: 'Advanced features include real-time collaboration, custom workflows...',
      path: './example-output/supabase-doc2.mp4',
    },
  ];

  // Encode all documents
  console.log('\n📚 Encoding documents...');
  for (const doc of documents) {
    console.log(`\nProcessing: ${doc.id}`);
    await encoder.addDocument(doc.id, doc.text, doc.path);
  }

  // Create retriever
  const retriever = new QRVideoStoreRetriever(database, embedder);

  // Search across all videos
  console.log('\n🔍 Searching across all documents...');
  const query = 'How do I get started?';
  
  const allVideos = documents.map(d => d.path);
  const results = await retriever.searchMultiple(query, allVideos, 5);

  console.log(`\nResults for: "${query}"\n`);
  results.forEach((result, i) => {
    console.log(`${i + 1}. [${result.similarity.toFixed(2)}] ${result.documentId}`);
    console.log(`   ${result.text}\n`);
  });

  console.log('✅ Demo complete!');
  console.log('\n💡 Your data is now persisted in Supabase!');
  console.log('   You can query it anytime without re-encoding.');
}

main().catch(console.error);

