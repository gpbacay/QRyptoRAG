# 📚 QR-Video-RAG Examples

> **Open source examples for the revolutionary QR-encoded video RAG system**

[![Open Source](https://img.shields.io/badge/Open%20Source-Yes-green)](https://github.com/gpbacay/qryptorag)

This directory contains example implementations of qr-video-rag, an open source high-density knowledge storage system for RAG applications.

## Running Examples

### Basic Usage (Completely Self-Contained)

No API keys or external services required - everything works offline:

```bash
npm install
npm run build
npx tsx examples/basic-usage.ts
```

This example demonstrates:
- Text chunking and QR code generation
- Video encoding with FFmpeg
- Semantic search using built-in text hashing
- Complete end-to-end workflow

## Example Files

- **`basic-usage.ts`** - Complete self-contained example showing all features

## Tips

1. The example creates a video file in `./example-output/` directory
2. Videos are small and can be committed to git for testing
3. Check the console output for detailed logs showing compression ratios
4. The simple embedder uses deterministic hashing for reproducible results

## Next Steps

After running the example:
- Read the main [README](../README.md) for API details
- Customize the embedder by implementing your own hashing algorithm
- Integrate into your own RAG pipeline
- Experiment with different chunk sizes and video settings

