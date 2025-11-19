import React from "react";
import { CodeBlock } from "@/components/code-block"

export type NavItem = {
  title: string
  href: string
  disabled?: boolean
}

export type DocsConfig = {
  mainNav: NavItem[]
  sidebarNav: {
    title: string
    items: NavItem[]
  }[]
}

export const docsConfig: DocsConfig = {
  mainNav: [
    {
      title: "Documentation",
      href: "/docs",
    },
    {
      title: "GitHub",
      href: "https://github.com/gpbacay/qryptorag",
    },
  ],
  sidebarNav: [
    {
      title: "Getting Started",
      items: [
        {
          title: "Overview",
          href: "/docs",
        },
        {
          title: "Installation",
          href: "/docs/installation",
        },
      ],
    },
    {
      title: "Core Concepts",
      items: [
        {
          title: "Architecture",
          href: "/docs/architecture",
        },
        {
          title: "Adapters",
          href: "/docs/adapters",
        },
        {
          title: "Encoding & Retrieval",
          href: "/docs/encoding-retrieval",
        },
      ],
    },
    {
      title: "API Reference",
      items: [
        {
          title: "API Reference",
          href: "/docs/api-reference",
        },
      ],
    },
    {
      title: "Guides",
      items: [
        {
          title: "Examples",
          href: "/docs/examples",
        },
      ],
    },
    {
      title: "Other",
      items: [
        {
          title: "Changelog",
          href: "/docs/changelog",
        },
        {
          title: "FAQ",
          href: "/docs/faq",
        },
      ],
    },
  ],
}

export type DocPage = {
  slug: string
  title: string
  description?: string
  content: React.ReactNode
}

const docsContent: DocPage[] = [
  {
    slug: "overview",
    title: "Overview",
    description: "QRyptoRAG transforms text documents into searchable, compressed MP4 videos using QR code encoding. A self-contained solution for RAG systems without external API dependencies.",
    content: (
      <>
        <h2 id="why-qr-video-rag">Why QRyptoRAG?</h2>
        <p>Traditional RAG systems rely on vector databases, but QRyptoRAG takes a novel approach: encoding knowledge as QR codes within MP4 video files. This provides:</p>
        <ul className="my-4 ml-6 list-disc [&>li]:mt-2">
          <li><strong>80-95% Compression:</strong> H.264 video compression dramatically reduces storage requirements.</li>
          <li><strong>Self-Contained:</strong> No external APIs or databases - just MP4 files that work anywhere.</li>
          <li><strong>Semantic Search:</strong> Vector embeddings enable fast, accurate retrieval from video content.</li>
          <li><strong>Portable Format:</strong> Standard MP4 files work on any device, online or offline.</li>
        </ul>
        <h2 id="how-it-works">How It Works</h2>
        <p>QRyptoRAG operates through a simple two-phase process:</p>
        <ol className="my-4 ml-6 list-decimal [&>li]:mt-2">
          <li><strong>Encoding:</strong> Text documents are chunked, converted to QR codes, and encoded as MP4 video frames.</li>
          <li><strong>Retrieval:</strong> User queries are semantically matched to extract relevant QR codes from video frames.</li>
        </ol>
        <p>This approach leverages video compression algorithms' superior efficiency at storing visual data compared to traditional text storage methods.</p>
      </>
    ),
  },
  {
    slug: "installation",
    title: "Installation",
    description: "Get started with QRyptoRAG by installing the qr-video-rag package from NPM.",
    content: (
      <>
        <p>You can add QRyptoRAG to your project using npm, yarn, or pnpm. The package includes FFmpeg for video processing.</p>
        <h3 className="mt-4 font-semibold">NPM</h3>
        <CodeBlock code="npm install qr-video-rag" />
        <h3 className="mt-4 font-semibold">Yarn</h3>
        <CodeBlock code="yarn add qr-video-rag" />
        <h3 className="mt-4 font-semibold">PNPM</h3>
        <CodeBlock code="pnpm add qr-video-rag" />
        <h3 className="mt-4 font-semibold">System Requirements</h3>
        <ul className="my-4 ml-6 list-disc [&>li]:mt-2">
          <li><strong>Node.js</strong> &gt;= 18.0.0</li>
          <li><strong>FFmpeg</strong> (automatically included via ffmpeg-static)</li>
        </ul>
      </>
    ),
  },
  {
    slug: "architecture",
    title: "Architecture",
    description: "Understand the QR-Video approach and how QRyptoRAG transforms text into searchable MP4 videos.",
    content: (
      <>
        <h2 id="encoding-process">Encoding Process: Text → QR → Video</h2>
        <p>The encoding process transforms raw text documents into compressed MP4 videos:</p>
        <ol className="my-4 ml-6 list-decimal [&>li]:mt-2">
          <li><strong>Text Chunking:</strong> Documents are split into chunks (500 chars + 50 char overlap)</li>
          <li><strong>QR Generation:</strong> Each chunk becomes a QR code using the qrcode library</li>
          <li><strong>Video Creation:</strong> QR codes are encoded as video frames using FFmpeg with H.264 compression</li>
          <li><strong>Vector Indexing:</strong> Embeddings are stored in a vector database for semantic search</li>
        </ol>

        <h2 id="retrieval-process">Retrieval Process: Query → Frames → Text</h2>
        <p>The retrieval process extracts relevant content from MP4 videos:</p>
        <ol className="my-4 ml-6 list-decimal [&>li]:mt-2">
          <li><strong>Semantic Search:</strong> Query is converted to embedding and matched against vector database</li>
          <li><strong>Frame Extraction:</strong> Relevant video frames are extracted using FFmpeg</li>
          <li><strong>QR Decoding:</strong> QR codes are decoded using jsQR to retrieve original text</li>
          <li><strong>Content Return:</strong> Retrieved text chunks are returned to the user</li>
        </ol>

        <h2 id="key-components">Key Components</h2>
        <ul className="my-4 ml-6 list-disc [&>li]:mt-2">
          <li><strong>QRVideoStoreEncoder:</strong> Handles text encoding and video creation</li>
          <li><strong>QRVideoStoreRetriever:</strong> Manages semantic search and content retrieval</li>
          <li><strong>Database Adapters:</strong> Support for Supabase, in-memory, file-based, and custom databases</li>
          <li><strong>Embedder Adapters:</strong> Integration with Gemini, Cohere, Hugging Face, and other embedding providers</li>
        </ul>
      </>
    ),
  },
  {
    slug: "adapters",
    title: "Adapters",
    description: "Learn about database and embedder adapters that connect QRyptoRAG to different vector databases and embedding providers.",
    content: (
      <>
        <h2 id="database-adapters">Database Adapters</h2>
        <p>QRyptoRAG supports multiple vector database backends through adapter interfaces:</p>
        <ul className="my-4 ml-6 list-disc [&>li]:mt-2">
          <li><strong>Supabase (pgvector):</strong> Production-ready with PostgreSQL and pgvector</li>
          <li><strong>In-Memory:</strong> Perfect for development and testing</li>
          <li><strong>File-based:</strong> JSON file storage for simple use cases</li>
          <li><strong>Custom:</strong> Implement your own database adapter</li>
        </ul>

        <h3 className="mt-6 font-semibold">Using Supabase</h3>
        <CodeBlock code={`import { createClient } from '@supabase/supabase-js';
import { createSupabaseAdapter } from 'qr-video-rag';

const supabase = createClient(URL, KEY);
const database = createSupabaseAdapter(supabase);`} />

        <h2 id="embedder-adapters">Embedder Adapters</h2>
        <p>Generate semantic embeddings using your preferred provider:</p>
        <ul className="my-4 ml-6 list-disc [&>li]:mt-2">
          <li><strong>Google Gemini:</strong> Primary embedder, high quality and cost-effective</li>
          <li><strong>Cohere:</strong> Multilingual embeddings with strong performance</li>
          <li><strong>Hugging Face:</strong> Open-source models for privacy-focused deployments</li>
          <li><strong>Google AI:</strong> Alternative Google embedding service</li>
          <li><strong>Mock/Cached:</strong> For testing and performance optimization</li>
        </ul>

        <h3 className="mt-6 font-semibold">Using Gemini Embeddings</h3>
        <CodeBlock code={`import { createGeminiEmbedder } from 'qr-video-rag';

const embedder = createGeminiEmbedder(process.env.GEMINI_API_KEY);`} />
      </>
    ),
  },
  {
    slug: "encoding-retrieval",
    title: "Encoding & Retrieval",
    description: "Deep dive into how QRyptoRAG encodes text into QR-video format and retrieves content through semantic search.",
    content: (
      <>
        <h2 id="basic-usage">Basic Usage</h2>
        <CodeBlock code={`import {
  QRVideoStoreEncoder,
  QRVideoStoreRetriever,
  createInMemoryAdapter,
  createGeminiEmbedder
} from 'qr-video-rag';

// Setup components
const database = createInMemoryAdapter();
const embedder = createGeminiEmbedder(process.env.GEMINI_API_KEY!);

// Create encoder
const encoder = new QRVideoStoreEncoder(database, embedder, {
  chunkSize: 500,
  chunkOverlap: 50,
  videoFps: 1
});

// Encode document
await encoder.addDocument('my-doc', textContent, './output.mp4');

// Create retriever
const retriever = new QRVideoStoreRetriever(database, embedder);

// Search and retrieve
const results = await retriever.search('How do I configure?', './output.mp4', 5);
console.log(results);`} />

        <h2 id="configuration-options">Configuration Options</h2>
        <ul className="my-4 ml-6 list-disc [&>li]:mt-2">
          <li><strong>chunkSize:</strong> Text chunk size in characters (default: 500)</li>
          <li><strong>chunkOverlap:</strong> Overlap between chunks (default: 50)</li>
          <li><strong>videoFps:</strong> Video frame rate (default: 1 FPS)</li>
          <li><strong>qrErrorCorrectionLevel:</strong> QR code error correction ('L', 'M', 'Q', 'H')</li>
          <li><strong>videoResolution:</strong> Output video dimensions</li>
        </ul>

        <h2 id="performance-considerations">Performance Considerations</h2>
        <ul className="my-4 ml-6 list-disc [&>li]:mt-2">
          <li><strong>Compression Ratios:</strong> 80-95% reduction in file size</li>
          <li><strong>Search Speed:</strong> ~50ms semantic search + ~1-2s retrieval</li>
          <li><strong>Chunk Size Impact:</strong> Larger chunks = fewer frames = faster retrieval</li>
          <li><strong>Video FPS:</strong> Lower FPS = smaller files, slower encoding</li>
        </ul>

        <h2 id="use-cases">Use Cases</h2>
        <p>QRyptoRAG excels in scenarios requiring portable, self-contained knowledge:</p>
        <ul className="my-4 ml-6 list-disc [&>li]:mt-2">
          <li><strong>Documentation Assistants:</strong> Encode entire docs as MP4 files</li>
          <li><strong>Offline AI Apps:</strong> Deploy knowledge to edge devices</li>
          <li><strong>Versioned Knowledge:</strong> Time-travel through documentation versions</li>
          <li><strong>Multi-language Support:</strong> Separate videos per language</li>
        </ul>
      </>
    ),
  },
  {
    slug: "api-reference",
    title: "API Reference",
    description: "Complete API reference for QRVideoStoreEncoder, QRVideoStoreRetriever, and all adapter functions.",
    content: (
      <>
        <h2 id="qr-video-store-encoder">QRVideoStoreEncoder</h2>
        <h3 className="mt-4 font-semibold">Constructor</h3>
        <CodeBlock code={`new QRVideoStoreEncoder(
  database: VectorDatabase,
  embedder: Embedder,
  config?: QRVideoStoreConfig
)`} />

        <h3 className="mt-4 font-semibold">Methods</h3>
        <ul className="my-4 ml-6 list-disc [&>li]:mt-2">
          <li><code>addDocument(documentId, text, outputPath, metadata?)</code> - Encode document</li>
          <li><code>addDocumentsBatch(documents)</code> - Encode multiple documents</li>
          <li><code>chunkText(text)</code> - Split text into chunks</li>
          <li><code>getStats(videoPath, originalText)</code> - Get compression statistics</li>
        </ul>

        <h2 id="qr-video-store-retriever">QRVideoStoreRetriever</h2>
        <h3 className="mt-4 font-semibold">Constructor</h3>
        <CodeBlock code={`new QRVideoStoreRetriever(
  database: VectorDatabase,
  embedder: Embedder,
  options?: { verbose?: boolean; maxCacheSize?: number }
)`} />

        <h3 className="mt-4 font-semibold">Methods</h3>
        <ul className="my-4 ml-6 list-disc [&>li]:mt-2">
          <li><code>search(query, videoPath, matchCount?)</code> - Main search method</li>
          <li><code>searchMultiple(query, videoPaths, matchCount?)</code> - Search multiple videos</li>
          <li><code>retrieveChunks(query, matchCount?)</code> - Get chunk metadata</li>
          <li><code>clearCache()</code> - Clear frame cache</li>
        </ul>

        <h2 id="database-adapters">Database Adapters</h2>
        <CodeBlock code={`// Production-ready
createSupabaseAdapter(client, tableName?)

// Development/testing
createInMemoryAdapter()

// Simple storage
createFileAdapter(filePath)

// Custom implementation
createCustomAdapter(implementation)`} />

        <h2 id="embedder-adapters">Embedder Adapters</h2>
        <CodeBlock code={`// Primary embedder
createGeminiEmbedder(apiKey, model?)

// Alternative providers
createGoogleAIEmbedder(apiKey, model?)
createCohereEmbedder(apiKey, model?)
createHuggingFaceEmbedder(apiKey, model?)

// Testing/performance
createMockEmbedder(dimension?)
createCachedEmbedder(embedder, maxCacheSize?)

createCustomEmbedder(embedFn, dimension?)`} />
      </>
    ),
  },
  {
    slug: "examples",
    title: "Examples",
    description: "Practical examples showing QRyptoRAG in action with different databases, embedders, and use cases.",
    content: (
      <>
        <h2 id="basic-usage">Basic Usage</h2>
        <CodeBlock code={`import {
  QRVideoStoreEncoder,
  QRVideoStoreRetriever,
  createInMemoryAdapter,
  createGeminiEmbedder
} from 'qr-video-rag';

// Setup
const database = createInMemoryAdapter();
const embedder = createGeminiEmbedder(process.env.GEMINI_API_KEY!);

// Encode
const encoder = new QRVideoStoreEncoder(database, embedder);
await encoder.addDocument('guide', userGuideText, './guide.mp4');

// Search
const retriever = new QRVideoStoreRetriever(database, embedder);
const results = await retriever.search('authentication setup', './guide.mp4', 3);`} />

        <h2 id="with-supabase">With Supabase</h2>
        <CodeBlock code={`import { createClient } from '@supabase/supabase-js';
import { createSupabaseAdapter } from 'qr-video-rag';

const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);
const database = createSupabaseAdapter(supabase);

const encoder = new QRVideoStoreEncoder(database, embedder);
await encoder.addDocument('docs', documentation, './docs.mp4');`} />

        <h2 id="batch-processing">Batch Processing</h2>
        <CodeBlock code={`await encoder.addDocumentsBatch([
  { documentId: 'api-docs', documentText: apiText, outputVideoPath: './api.mp4' },
  { documentId: 'user-guide', documentText: guideText, outputVideoPath: './guide.mp4' },
  { documentId: 'faq', documentText: faqText, outputVideoPath: './faq.mp4' }
]);`} />

        <h2 id="search-multiple-videos">Search Multiple Videos</h2>
        <CodeBlock code={`const results = await retriever.searchMultiple(
  'payment processing',
  ['./api.mp4', './guide.mp4', './faq.mp4'],
  5
);`} />

        <h2 id="custom-configuration">Custom Configuration</h2>
        <CodeBlock code={`const encoder = new QRVideoStoreEncoder(database, embedder, {
  chunkSize: 1000,           // Larger chunks
  chunkOverlap: 100,         // More overlap
  videoFps: 2,               // Higher frame rate
  qrErrorCorrectionLevel: 'H', // High error correction
  videoResolution: { width: 512, height: 512 },
  verbose: true              // Enable logging
});`} />
      </>
    ),
  },
  {
    slug: "changelog",
    title: "Changelog",
    description: "Version history and release notes for QRyptoRAG.",
    content: (
      <>
        <p>The changelog is maintained in the main <a href="https://github.com/gpbacay/qryptorag/blob/main/CHANGELOG.md" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">qryptorag repository</a>.</p>

        <h3 className="mt-6 font-semibold">Latest Releases</h3>
        <ul className="my-4 ml-6 list-disc [&>li]:mt-2">
          <li><strong>v1.0.0</strong> - Initial release with core QR-video encoding and retrieval functionality</li>
          <li>Full TypeScript support and comprehensive API</li>
          <li>Multiple database and embedder adapters</li>
          <li>Production-ready with extensive testing</li>
        </ul>

        <p>For detailed change history, see the <a href="https://github.com/gpbacay/qryptorag/blob/main/CHANGELOG.md" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">CHANGELOG.md</a> file in the repository.</p>
      </>
    ),
  },
  {
    slug: "faq",
    title: "FAQ",
    description: "Frequently asked questions about QRyptoRAG and QR-video technology.",
    content: (
      <>
        <h3 className="mt-6 font-semibold">What is QRyptoRAG?</h3>
        <p>QRyptoRAG is a novel approach to high-density knowledge storage for RAG systems. It encodes text documents as QR codes within MP4 video files, achieving 80-95% compression through H.264 video encoding.</p>

        <h3 className="mt-6 font-semibold">How does it achieve such high compression?</h3>
        <p>By converting text to QR codes (visual data) and then compressing that visual data using H.264 video encoding. Video compression algorithms are highly optimized for visual information, far more efficient than traditional text compression methods.</p>

        <h3 className="mt-6 font-semibold">Do I need external APIs or databases?</h3>
        <p>No! QRyptoRAG is completely self-contained. Once encoded, your knowledge lives in standard MP4 files that work anywhere, online or offline, without any external dependencies.</p>

        <h3 className="mt-6 font-semibold">What are the performance characteristics?</h3>
        <ul className="my-4 ml-6 list-disc [&>li]:mt-2">
          <li><strong>Encoding:</strong> ~10-30 seconds for typical documents</li>
          <li><strong>Search:</strong> ~50ms semantic search + ~1-2s content retrieval</li>
          <li><strong>Compression:</strong> 80-95% size reduction</li>
          <li><strong>Storage:</strong> Standard MP4 files, universally compatible</li>
        </ul>

        <h3 className="mt-6 font-semibold">What's the difference from traditional RAG?</h3>
        <p>Traditional RAG stores text in vector databases with separate embedding generation. QRyptoRAG encodes knowledge directly into video files, eliminating the need for complex infrastructure while achieving better compression ratios.</p>

        <h3 className="mt-6 font-semibold">Is it production-ready?</h3>
        <p>Yes! QRyptoRAG is built with TypeScript, includes comprehensive testing, and has been designed for production use with features like error correction, caching, and multiple adapter support.</p>

        <h3 className="mt-6 font-semibold">What use cases is it best for?</h3>
        <ul className="my-4 ml-6 list-disc [&>li]:mt-2">
          <li>Documentation assistants and knowledge bases</li>
          <li>Offline AI applications and edge devices</li>
          <li>Versioned knowledge storage</li>
          <li>Multi-language content management</li>
          <li>Air-gapped or secure environments</li>
        </ul>
      </>
    ),
  },
]

export function getDocsPages() {
  return docsConfig.sidebarNav.flatMap(group => group.items)
}

export function getDocPage(slug: string) {
  const effectiveSlug = (slug === "") ? "overview" : slug
  return docsContent.find(page => page.slug === effectiveSlug)
}
