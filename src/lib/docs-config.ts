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
      href: "https://github.com/gianne-bacay/qryptography",
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
    description: "QRyptography is an open-source NPM package framework for high-density AI knowledge storage and retrieval. It leverages advanced encoding techniques to store vast amounts of information in a compact, queryable format using QR codes embedded in video files.",
    content: (
      <>
        <h2>Why QRyptography? The Challenge of Knowledge Management in RAG</h2>
        <p>
          In the rapidly evolving landscape of Retrieval-Augmented Generation (RAG) systems, efficient and scalable knowledge management is a critical challenge.
          Traditional vector databases, while powerful for semantic search, can face limitations with the sheer volume and complexity of data.
          QRyptography addresses this by introducing a novel approach to high-density knowledge storage, transforming textual information into a visual format embedded within MP4 video files.
        </p>
        <p>This approach offers:</p>
        <ul className="my-4 ml-6 list-disc [&>li]:mt-2">
          <li><strong>Extreme Data Density:</strong> Leveraging video compression to pack massive amounts of information into a compact, easily distributable format.</li>
          <li><strong>Persistent and Accessible Storage:</strong> Knowledge residing in a standard, universally playable file format, independent of complex database setups.</li>
          <li><strong>Novelty and Engagement:</strong> A unique technological solution that showcases innovative problem-solving in AI.</li>
        </ul>
        <h2>How it Works: Encoding and Retrieval</h2>
        <p>
          The QR Video Store operates through a two-phase process: encoding knowledge into video and then efficiently retrieving it for RAG purposes.
        </p>
        <h3>Encoding Process: Text to QR to Video</h3>
        <ul className="my-4 ml-6 list-disc [&>li]:mt-2">
          <li><strong>Text Chunking:</strong> Raw textual content is broken into manageable chunks (e.g., 500 characters with overlap) to ensure coherent information per QR code frame.</li>
          <li><strong>QR Code Generation:</strong> High-resolution QR codes are dynamically generated for each text chunk.</li>
          <li><strong>MP4 Video Creation:</strong> These QR code images are compiled into an MP4 video using FFmpeg, typically at 1 frame per second, with each second holding one QR-encoded chunk. H.264 compression is used for efficiency.</li>
          <li><strong>Index Storage:</strong> A metadata index is stored in a Supabase database, mapping each text chunk to its embedding (using Google AI's <code>text-embedding-004</code>), corresponding frame number, and original document ID. This vector index facilitates efficient semantic search.</li>
        </ul>
        <h3>Retrieval Process: Unlocking Knowledge from Video Frames</h3>
        <ul className="my-4 ml-6 list-disc [&>li]:mt-2">
          <li><strong>Semantic Search:</strong> User queries are converted into vector embeddings and used to search the Supabase metadata index for relevant text chunks and their frame numbers.</li>
          <li><strong>Frame Extraction:</strong> FFmpeg precisely extracts these specific frames as image buffers (e.g., PNGs) from the main video file.</li>
          <strong>QR Code Decoding:</strong> A QR code decoding library (like <code>jsQR</code>) reconstructs the original text chunk from the extracted QR code images.</li>
          <li><strong>Context Integration:</strong> The decoded text chunks are provided as primary context to the AI model (e.g., Google AI's Gemini 2.5 Flash) for accurate and relevant responses.</li>
        </ul>
        <h2>Key Features</h2>
        <ul className="my-4 ml-6 list-disc [&>li]:mt-2">
          <li><strong>Unparalleled Density:</strong> Store vast amounts of textual data in a remarkably compact video format.</li>
          <li><strong>Persistent and Portable Knowledge:</strong> Self-contained <code>.mp4</code> files for easy versioning, distribution, and access.</li>
          <li><strong>Primary Knowledge Source:</strong> Prioritize information from the QR Video Store for comprehensive AI responses.</li>
          <li><strong>Graceful Degradation:</strong> Seamless fallback to supplemental vector RAG and other knowledge sources if the video store is unavailable.</li>
          <li><strong>Showcasing Innovation:</strong> A creative and memorable solution highlighting advanced problem-solving.</li>
        </ul>
      </>
    ),
  },
  {
    slug: "installation",
    title: "Installation",
    description: "Get started with QRyptography by installing it from your favorite package manager.",
    content: (
      <>
        <p>You can add QRyptography to your project using npm, yarn, or pnpm. This will give you access to all the core functionalities of the framework.</p>
        <h3 className="mt-4 font-semibold">NPM</h3>
        <CodeBlock code="npm install qryptography" />
        <h3 className="mt-4 font-semibold">Yarn</h3>
        <CodeBlock code="yarn add qryptography" />
        <h3 className="mt-4 font-semibold">PNPM</h3>
        <CodeBlock code="pnpm add qryptography" />
      </>
    ),
  },
  {
    slug: "architecture",
    title: "Architecture",
    description: "Understand the high-level architecture of QRyptography and how its components work together.",
    content: (
      <>
        <h2>Overall RAG System Integration</h2>
        <p>
          QRyptography is designed as a primary knowledge source within a broader Retrieval-Augmented Generation (RAG) system.
          It integrates alongside other knowledge sources such as vector databases, knowledge graphs, and web search capabilities,
          prioritizing the high-density information stored within its QR Video Store.
        </p>
        <p>The system's knowledge sources are structured as follows:</p>
        <ul className="my-4 ml-6 list-disc [&>li]:mt-2">
          <li><strong>QR Video Store:</strong> Primary high-density storage using MP4 video files.</li>
          <li><strong>Vector Database (e.g., Supabase pgvector):</strong> Secondary source for semantic search.</li>
          <li><strong>Knowledge Graph:</strong> Tertiary source for entity relationships and community detection.</li>
          <li><strong>Web Search:</strong> Supplemental source for real-time and current information.</li>
        </ul>
        <h2>Data Flow: From Raw Text to Queryable Knowledge</h2>
        <h3>Encoding Phase</h3>
        <p>
          The encoding process transforms raw textual data into a highly compressed, visually encoded format within MP4 video files.
          This multi-step pipeline ensures efficient storage and retrieval of knowledge.
        </p>
        <ul className="my-4 ml-6 list-disc [&>li]:mt-2">
          <li><strong>Portfolio Documents (PDF/Text Files):</strong> Initial source of knowledge.</li>
          <li><strong>Document Scanner & Text Extraction:</strong> Processes documents to extract raw text content.</li>
          <li><strong>Text Chunking:</strong> Divides extracted text into manageable chunks (e.g., 500 characters with overlap).</li>
          <li><strong>Generate Embeddings:</strong> Creates vector embeddings for each text chunk (e.g., using Google AI's <code>text-embedding-004</code>).</li>
          <li><strong>Create QR Codes:</strong> Generates high-resolution QR codes from text chunks.</li>
          <li><strong>Build Video (FFmpeg H.264):</strong> Compiles QR code images into an MP4 video file at a low frame rate (1 FPS).</li>
          <li><strong>Store Index (Supabase Database):</strong> Stores a metadata index mapping text chunks to embeddings, frame numbers, and original document IDs.</li>
        </ul>
        <h3>Retrieval Phase</h3>
        <p>
          The retrieval phase focuses on efficiently extracting relevant knowledge from the QR Video Store based on user queries.
        </p>
        <ul className="my-4 ml-6 list-disc [&>li]:mt-2">
          <li><strong>User Query:</strong> The starting point for knowledge retrieval.</li>
          <li><strong>Semantic Search (Vector Similarity):</strong> Converts the query into an embedding and searches the Supabase index for relevant frame numbers.</li>
          <li><strong>Extract Frame (from MP4):</strong> Uses FFmpeg to precisely extract the identified video frames as image buffers.</li>
          <li><strong>Decode QR Code (to Text):</strong> Decodes the QR code images back into original text chunks.</li>
          <li><strong>Retrieved Content (for Response):</strong> Provides the decoded text chunks to the AI model for generating responses.</li>
        </ul>
      </>
    ),
  },
  {
    slug: "adapters",
    title: "Adapters",
    description: "Learn how to use and create adapters to connect QRyptography to different data sources.",
    content: <p>This page is a placeholder. Content for Adapters will be added soon.</p>,
  },
  {
    slug: "encoding-retrieval",
    title: "Encoding & Retrieval",
    description: "A deep dive into the encoding and retrieval mechanisms at the heart of QRyptography.",
    content: (
      <>
        <h2>The Core Innovation: Encoding Text into Video</h2>
        <p>
          The QR Video Store's fundamental innovation lies in its multi-step transformation of textual data into a highly compressed video format.
          This process leverages the efficiency of video compression algorithms to store vast amounts of information in a compact, visual medium.
        </p>
        <h3>1. Data Transformation: Text to QR to Video</h3>
        <ul className="my-4 ml-6 list-disc [&>li]:mt-2">
          <li><strong>Raw Text (e.g., Portfolio Content):</strong> The initial textual data to be stored.</li>
          <li><strong>Text Processing & Character Encoding (UTF-8):</strong> Ensures consistent and efficient handling of text data.</li>
          <li><strong>QR Code Algorithm (Error Correction):</strong> Converts encoded text into a pixel matrix, incorporating error correction for robust retrieval.</li>
          <li><strong>Pixel Matrix (Black & White) to Image Buffer (PNG Format):</strong> Transforms QR code data into an image format suitable for video.</li>
          <li><strong>Video Frame (H.264 Compression) to MP4 Container:</strong> Each QR code image becomes a video frame, highly compressed and stored within a standard MP4 file.</li>
        </ul>
        <h3>2. Encoding Process: From Text Chunks to Indexed Video</h3>
        <p>
          When the QR Video Store is initialized, relevant documents are processed through a meticulous pipeline:
        </p>
        <ul className="my-4 ml-6 list-disc [&>li]:mt-2">
          <li><strong>Document Scanning:</strong> Processes documents (PDFs, text files) to extract content.</li>
          <li><strong>Text Chunking:</strong> Content is broken into manageable chunks (e.g., 500 characters with 50 character overlap) to maintain context.</li>
          <li><strong>Generate Embeddings:</strong> Each text chunk is converted into a vector embedding (e.g., using Google AI's <code>text-embedding-004</code>).</li>
          <li><strong>Create QR Codes:</strong> High-resolution QR codes are generated for each text chunk using libraries like <code>qrcode</code>.</li>
          <li><strong>Build Video:</strong> The QR code images are compiled into an MP4 video using <code>ffmpeg</code> at a very low frame rate (e.g., 1 frame per second), ensuring each second holds one chunk of information.</li>
          <li><strong>Store Index:</strong> A metadata index is created and stored in a Supabase database, mapping each text chunk to its embedding, corresponding frame number, and original document ID. This index is crucial for semantic search.</li>
        </ul>
        <h2>Retrieval: Unlocking Knowledge from Video Frames</h2>
        <p>
          When a user query requires information from the QR Video Store, the retrieval process efficiently extracts the necessary knowledge:
        </p>
        <ul className="my-4 ml-6 list-disc [&>li]:mt-2">
          <li><strong>Semantic Search:</strong> The user's query is converted into a vector embedding, which is then used to perform a similarity search against the QR Video Store's metadata index in Supabase to identify relevant text chunks and their corresponding frame numbers.</li>
          <li><strong>Frame Extraction:</strong> Using <code>ffmpeg</code>, the system precisely extracts the identified video frames as image buffers (e.g., PNGs) from the main <code>qr_video_store.mp4</code> file.</li>
          <li><strong>QR Code Decoding:</strong> The extracted image buffers (QR code images) are fed into a QR code decoding library (like <code>jsQR</code>) to reconstruct the original text chunk.</li>
          <li><strong>Context Integration:</strong> The decoded text chunks are then provided as the primary context to the AI model (e.g., Google AI's Gemini 2.5 Flash), enabling it to generate accurate and relevant responses.</li>
        </ul>
      </>
    ),
  },
  {
    slug: "api-reference",
    title: "API Reference",
    description: "Detailed API reference for all public methods and classes in QRyptography.",
    content: <p>This page is a placeholder. Content for API Reference will be added soon.</p>,
  },
  {
    slug: "examples",
    title: "Examples",
    description: "See QRyptography in action with practical examples and use cases.",
    content: <p>This page is a placeholder. Content for Examples will be added soon.</p>,
  },
  {
    slug: "changelog",
    title: "Changelog",
    description: "A log of all changes, new features, and bug fixes for each version of QRyptography.",
    content: <p>This page is a placeholder. Content for Changelog will be added soon.</p>,
  },
  {
    slug: "faq",
    title: "FAQ",
    description: "Frequently asked questions about QRyptography.",
    content: <p>This page is a placeholder. Content for FAQ will be added soon.</p>,
  },
]

export function getDocsPages() {
  return docsConfig.sidebarNav.flatMap(group => group.items)
}

export function getDocPage(slug: string) {
  const effectiveSlug = (slug === "") ? "overview" : slug
  return docsContent.find(page => page.slug === effectiveSlug)
}
