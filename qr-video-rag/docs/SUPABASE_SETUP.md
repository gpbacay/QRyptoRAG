# Supabase Setup Guide

Complete guide for setting up qr-video-rag with Supabase.

## Prerequisites

- Supabase account ([sign up](https://supabase.com))
- Node.js project with qr-video-rag installed

## Step 1: Enable pgvector Extension

In your Supabase dashboard:

1. Go to **Database** → **Extensions**
2. Search for "vector"
3. Enable the **pgvector** extension

Or via SQL:

```sql
CREATE EXTENSION IF NOT EXISTS vector;
```

## Step 2: Create Table

Run this SQL in the Supabase SQL Editor:

```sql
-- Create the qr_video_store_index table
CREATE TABLE qr_video_store_index (
  id BIGSERIAL PRIMARY KEY,
  chunk_text TEXT NOT NULL,
  embedding VECTOR(1536),  -- Adjust dimension based on your embedder
  frame_number INTEGER NOT NULL,
  document_id TEXT NOT NULL,
  chunk_index INTEGER,
  metadata JSONB DEFAULT '{}'::jsonb,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX idx_document_id ON qr_video_store_index(document_id);
CREATE INDEX idx_frame_number ON qr_video_store_index(frame_number);
CREATE INDEX idx_embedding ON qr_video_store_index USING ivfflat (embedding vector_cosine_ops);
```

### Embedding Dimensions by Provider

Adjust the `VECTOR(1536)` dimension based on your embedder:

| Provider | Model | Dimension |
|----------|-------|-----------|
| Google Gemini | text-embedding-004 | 768 |
| Google AI | text-embedding-004 | 768 |
| Cohere | embed-english-v3.0 | 1024 |
| Hugging Face | various models | varies |

**Recommended:** Use Google Gemini with `VECTOR(768)`

## Step 3: Create RPC Function

Create a function for similarity search:

```sql
-- Create function for similarity search
CREATE OR REPLACE FUNCTION match_qr_video_store_chunks(
  query_embedding VECTOR(1536),
  match_count INT DEFAULT 5,
  filter_document_id TEXT DEFAULT NULL
)
RETURNS TABLE (
  chunk_text TEXT,
  embedding VECTOR(1536),
  frame_number INTEGER,
  document_id TEXT,
  chunk_index INTEGER,
  metadata JSONB,
  similarity FLOAT
)
LANGUAGE SQL STABLE
AS $$
  SELECT
    chunk_text,
    embedding,
    frame_number,
    document_id,
    chunk_index,
    metadata,
    1 - (embedding <=> query_embedding) AS similarity
  FROM qr_video_store_index
  WHERE 
    CASE 
      WHEN filter_document_id IS NOT NULL THEN document_id = filter_document_id
      ELSE TRUE
    END
  ORDER BY embedding <=> query_embedding
  LIMIT match_count;
$$;
```

## Step 4: Enable Row Level Security (Optional)

For multi-tenant applications:

```sql
-- Enable RLS
ALTER TABLE qr_video_store_index ENABLE ROW LEVEL SECURITY;

-- Allow authenticated users to read
CREATE POLICY "Allow authenticated read"
  ON qr_video_store_index
  FOR SELECT
  TO authenticated
  USING (true);

-- Allow authenticated users to insert
CREATE POLICY "Allow authenticated insert"
  ON qr_video_store_index
  FOR INSERT
  TO authenticated
  WITH CHECK (true);

-- Optional: User-specific access
CREATE POLICY "Users can only see their own data"
  ON qr_video_store_index
  FOR SELECT
  TO authenticated
  USING (auth.uid()::text = (metadata->>'user_id'));
```

## Step 5: Get Your Credentials

1. Go to **Settings** → **API**
2. Copy your:
   - Project URL
   - Project API key (anon/public)

## Step 6: Use in Your Code

```typescript
import { createClient } from '@supabase/supabase-js';
import { createSupabaseAdapter, createGeminiEmbedder } from 'qr-video-rag';

// Initialize Supabase
const supabase = createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_KEY!
);

// Create database adapter
const database = createSupabaseAdapter(supabase);

// Create embedder (Google Gemini)
const embedder = createGeminiEmbedder(process.env.GEMINI_API_KEY!);

// Now use as normal
const encoder = new QRVideoStoreEncoder(database, embedder);
await encoder.addDocument('doc-id', text, './output.mp4');
```

## Environment Variables

Create a `.env.local` file:

```env
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_KEY=your-anon-key
GEMINI_API_KEY=your-gemini-api-key
```

## Advanced Configuration

### Custom Table Name

```typescript
const database = createSupabaseAdapter(
  supabase,
  'my_custom_table_name'
);
```

### Custom RPC Function

```typescript
const database = createSupabaseAdapter(
  supabase,
  'qr_video_store_index',
  'my_custom_search_function'
);
```

### Filter by Document ID

Modify your RPC function to support filtering:

```typescript
// In your search logic
const { data } = await supabase.rpc('match_qr_video_store_chunks', {
  query_embedding: embedding,
  match_count: 5,
  filter_document_id: 'specific-doc-id'
});
```

## Performance Optimization

### 1. Adjust IVFFlat Lists

For better performance with large datasets:

```sql
-- Create index with custom lists parameter
CREATE INDEX idx_embedding ON qr_video_store_index 
USING ivfflat (embedding vector_cosine_ops)
WITH (lists = 100);  -- Adjust based on dataset size
```

**Guidelines:**
- Small dataset (<1M vectors): `lists = 100`
- Medium dataset (1M-10M): `lists = 1000`
- Large dataset (>10M): `lists = 10000`

### 2. Vacuum and Analyze

Regularly optimize your table:

```sql
VACUUM ANALYZE qr_video_store_index;
```

### 3. Monitor Query Performance

```sql
EXPLAIN ANALYZE
SELECT * FROM match_qr_video_store_chunks(
  '[0.1, 0.2, ...]'::vector,
  5
);
```

## Backup and Restore

### Export Data

```typescript
const { data } = await supabase
  .from('qr_video_store_index')
  .select('*');

fs.writeFileSync('backup.json', JSON.stringify(data));
```

### Import Data

```typescript
const backupData = JSON.parse(fs.readFileSync('backup.json', 'utf-8'));

const { error } = await supabase
  .from('qr_video_store_index')
  .insert(backupData);
```

## Troubleshooting

### "relation does not exist" Error

Make sure you've created the table in Step 2.

### "function match_qr_video_store_chunks does not exist"

Run the SQL from Step 3.

### Slow Queries

1. Check if pgvector extension is enabled
2. Create the IVFFlat index (Step 2)
3. Run `VACUUM ANALYZE`

### Dimension Mismatch

Ensure your embedding dimension matches the table:

```sql
-- Check current dimension
SELECT 
  column_name, 
  data_type 
FROM information_schema.columns 
WHERE table_name = 'qr_video_store_index' 
  AND column_name = 'embedding';

-- Alter if needed (WARNING: drops existing data)
ALTER TABLE qr_video_store_index 
  ALTER COLUMN embedding TYPE VECTOR(768);
```

## Migration from In-Memory

If you started with in-memory adapter:

```typescript
// 1. Export from in-memory
const inMemoryDb = createInMemoryAdapter();
// ... (your existing data)

// 2. Switch to Supabase
const supabaseDb = createSupabaseAdapter(supabase);

// 3. Re-encode documents to populate Supabase
await encoder.addDocument(docId, text, videoPath);
```

## Cost Estimation

Supabase offers generous free tier:
- **Free tier**: Up to 500MB database
- **Pro tier**: $25/month for 8GB
- **Storage**: ~1KB per chunk (1000 chunks ≈ 1MB)

**Example:**
- 100 documents × 1000 chunks = 100,000 chunks
- Storage needed: ~100MB
- Cost: Free tier ✅

## Next Steps

- [API Documentation](./API.md)
- [Examples with Supabase](../examples/with-supabase.ts)
- [Supabase Documentation](https://supabase.com/docs)

## Support

Need help? Open an issue on [GitHub](https://github.com/giannebacay/qr-video-rag/issues).

