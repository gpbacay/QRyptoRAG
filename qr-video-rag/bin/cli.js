#!/usr/bin/env node

/**
 * QR Video RAG - CLI Tool
 * 
 * Command-line interface for encoding and searching QR video stores
 */

const fs = require('fs');
const path = require('path');

// Display help
function showHelp() {
  console.log(`
📹 QR Video RAG - CLI Tool

Usage:
  qr-video-rag <command> [options]

Commands:
  encode <input> <output>     Encode a text file into QR video
  search <query> <video>      Search for content in a QR video
  info <video>                Display information about a QR video
  help                        Show this help message

Examples:
  # Encode a document
  qr-video-rag encode ./docs.txt ./output/docs.mp4

  # Search a video
  qr-video-rag search "authentication" ./output/docs.mp4

  # Get video info
  qr-video-rag info ./output/docs.mp4

Environment Variables:
  GEMINI_API_KEY             Google Gemini API key for embeddings (stored in .env.local)
  EMBEDDING_PROVIDER         Embedding provider (gemini, google, mock)

For more information, visit: https://github.com/giannebacay/qr-video-rag
`);
}

// Main CLI handler
async function main() {
  const args = process.argv.slice(2);
  const command = args[0];

  if (!command || command === 'help' || command === '--help' || command === '-h') {
    showHelp();
    process.exit(0);
  }

  try {
    // Dynamically import the compiled package
    const pkg = require('../dist/index.js');

    switch (command) {
      case 'encode':
        await handleEncode(args, pkg);
        break;
      
      case 'search':
        await handleSearch(args, pkg);
        break;
      
      case 'info':
        await handleInfo(args, pkg);
        break;
      
      default:
        console.error(`❌ Unknown command: ${command}`);
        console.log('Run "qr-video-rag help" for usage information.');
        process.exit(1);
    }
  } catch (error) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  }
}

// Handle encode command
async function handleEncode(args, pkg) {
  const inputPath = args[1];
  const outputPath = args[2];

  if (!inputPath || !outputPath) {
    console.error('❌ Usage: qr-video-rag encode <input-file> <output-video>');
    process.exit(1);
  }

  if (!fs.existsSync(inputPath)) {
    console.error(`❌ Input file not found: ${inputPath}`);
    process.exit(1);
  }

  console.log('📄 Reading input file...');
  const text = fs.readFileSync(inputPath, 'utf-8');
  console.log(`   Size: ${(text.length / 1024).toFixed(2)} KB`);

  // Setup embedder
  const embedder = createEmbedder(pkg);
  const database = pkg.createInMemoryAdapter();

  console.log('\n🎬 Encoding video...');
  const encoder = new pkg.QRVideoStoreEncoder(database, embedder, {
    verbose: true,
  });

  const documentId = path.basename(inputPath, path.extname(inputPath));
  await encoder.addDocument(documentId, text, outputPath);

  // Get stats
  const stats = await encoder.getStats(outputPath, text);
  console.log(`\n✅ Video created successfully!`);
  console.log(`📊 Stats:`);
  console.log(`   Output: ${outputPath}`);
  console.log(`   Size: ${(stats.videoSizeBytes / 1024).toFixed(2)} KB`);
  console.log(`   Compression: ${(stats.compressionRatio * 100).toFixed(1)}%`);
  console.log(`   Frames: ${stats.totalFrames}`);
}

// Handle search command
async function handleSearch(args, pkg) {
  const query = args[1];
  const videoPath = args[2];
  const limit = parseInt(args[3] || '5', 10);

  if (!query || !videoPath) {
    console.error('❌ Usage: qr-video-rag search "<query>" <video-file> [limit]');
    process.exit(1);
  }

  if (!fs.existsSync(videoPath)) {
    console.error(`❌ Video file not found: ${videoPath}`);
    process.exit(1);
  }

  // Note: For search to work, you need to have encoded with the same embedder
  // and have the index persisted somewhere
  console.log('⚠️  Note: CLI search requires a persisted database index.');
  console.log('    For now, use the programmatic API for full search functionality.');
  console.log('    See examples/ for usage patterns.\n');

  console.log(`🔍 Query: "${query}"`);
  console.log(`📹 Video: ${videoPath}`);
  console.log(`🔢 Limit: ${limit}`);
}

// Handle info command
async function handleInfo(args, pkg) {
  const videoPath = args[1];

  if (!videoPath) {
    console.error('❌ Usage: qr-video-rag info <video-file>');
    process.exit(1);
  }

  if (!fs.existsSync(videoPath)) {
    console.error(`❌ Video file not found: ${videoPath}`);
    process.exit(1);
  }

  const stats = fs.statSync(videoPath);
  console.log(`\n📹 Video Information:`);
  console.log(`   Path: ${videoPath}`);
  console.log(`   Size: ${(stats.size / 1024).toFixed(2)} KB`);
  console.log(`   Modified: ${stats.mtime.toLocaleString()}`);
  console.log(`\n💡 To get full statistics, use the programmatic API:`);
  console.log(`   const stats = await encoder.getStats(videoPath, originalText);`);
}

// Create embedder based on environment
function createEmbedder(pkg) {
  // Load .env.local if exists
  require('dotenv').config({ path: '.env.local' });
  
  const provider = process.env.EMBEDDING_PROVIDER || 'gemini';

  switch (provider) {
    case 'gemini':
    case 'google':
      if (!process.env.GEMINI_API_KEY) {
        console.error('❌ GEMINI_API_KEY environment variable required');
        console.log('Add it to your .env.local file:');
        console.log('GEMINI_API_KEY=your-api-key');
        process.exit(1);
      }
      console.log('🤖 Using Google Gemini embeddings');
      return pkg.createGeminiEmbedder(process.env.GEMINI_API_KEY);
    
    case 'mock':
      console.log('🤖 Using mock embeddings (for demo only)');
      return pkg.createMockEmbedder();
    
    default:
      console.error(`❌ Unknown embedding provider: ${provider}`);
      console.log('Valid providers: gemini, google, mock');
      process.exit(1);
  }
}

// Run CLI
main().catch((error) => {
  console.error('❌ Fatal error:', error);
  process.exit(1);
});

