# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

### Planned
- [ ] Streaming support for large documents
- [ ] Multi-video collection manager
- [ ] Advanced compression options
- [ ] Cloud storage backends (S3, GCS, Azure)
- [ ] Incremental updates to existing videos
- [ ] Batch embedding optimization

## [1.0.0] - 2025-11-14

### Added
- Initial release of qr-video-rag
- Core `QRVideoStoreEncoder` class for encoding text to QR videos
- Core `QRVideoStoreRetriever` class for semantic search and retrieval
- Database adapters:
  - Supabase/pgvector adapter
  - In-memory adapter
  - File-based adapter
- Embedder adapters:
  - Google Gemini embeddings (primary)
  - Google AI embeddings
  - Cohere embeddings
  - Hugging Face embeddings
  - Mock embedder for testing
  - Cached embedder wrapper
- Comprehensive TypeScript type definitions
- CLI tool for encoding and searching
- Example implementations:
  - Basic usage example
  - Google Gemini integration example
  - Supabase integration example
- Full documentation:
  - README with usage guide
  - API reference documentation
  - Contributing guidelines
  - MIT License
- Configuration files:
  - TypeScript config
  - ESLint config
  - Prettier config
  - npm package config

### Features
- Text chunking with configurable overlap
- High-density QR code generation
- MP4 video creation with H.264 compression
- Frame-level caching for improved performance
- Batch document processing
- Multi-video search capability
- Compression statistics
- Verbose logging option

### Documentation
- Complete README with examples
- API reference for all classes and methods
- Contributing guidelines
- Example code for common use cases
- CLI documentation

---

[Unreleased]: https://github.com/giannebacay/qr-video-rag/compare/v1.0.0...HEAD
[1.0.0]: https://github.com/giannebacay/qr-video-rag/releases/tag/v1.0.0

