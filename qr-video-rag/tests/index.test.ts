/**
 * Basic test suite for QR Video RAG
 */

import { QRVideoStoreEncoder } from '../src/encoder';
import { QRVideoStoreRetriever } from '../src/retriever';
import { createInMemoryAdapter, createSimpleEmbedder } from '../src/adapters';

describe('QR Video RAG', () => {
  it('should create encoder and retriever instances', () => {
    const database = createInMemoryAdapter();
    const embedder = createSimpleEmbedder(128);

    const encoder = new QRVideoStoreEncoder(database, embedder);
    const retriever = new QRVideoStoreRetriever(database, embedder);

    expect(encoder).toBeInstanceOf(QRVideoStoreEncoder);
    expect(retriever).toBeInstanceOf(QRVideoStoreRetriever);
  });

  it('should chunk text correctly', () => {
    const database = createInMemoryAdapter();
    const embedder = createSimpleEmbedder(128);
    const encoder = new QRVideoStoreEncoder(database, embedder);

    const text = 'This is a test document with some content that should be chunked.';
    const chunks = encoder.chunkText(text);

    expect(chunks.length).toBeGreaterThan(0);
    expect(chunks[0].text).toBeDefined();
    expect(chunks[0].index).toBe(0);
  });
});
