# Examples

This directory contains example implementations of qr-video-rag.

## Running Examples

### 1. Basic Usage (No API Keys Required)

Uses mock embedder for demonstration:

```bash
npm install
npm run build
npx tsx examples/basic-usage.ts
```

### 2. Google Gemini Integration

Requires Google Gemini API key. Create a `.env.local` file in the root directory:

```bash
# .env.local
GEMINI_API_KEY=your-api-key
```

Then run:
```bash
npx tsx examples/with-gemini.ts ./path/to/document.txt
```

### 3. Supabase Integration

Requires both Supabase and Google Gemini credentials in `.env.local`:

```bash
# .env.local
SUPABASE_URL=your-url
SUPABASE_KEY=your-key
GEMINI_API_KEY=your-api-key
```

Then run:
```bash
npx tsx examples/with-supabase.ts
```

## Example Files

- **`basic-usage.ts`** - Simple end-to-end example with mock embedder
- **`with-gemini.ts`** - Production example using Google Gemini embeddings
- **`with-supabase.ts`** - Full production setup with Supabase vector database

## Tips

1. Start with `basic-usage.ts` to understand the flow
2. The examples create videos in `./example-output/` directory
3. Videos are small and can be committed to git for testing
4. Check the console output for detailed logs

## Next Steps

After running examples:
- Read the [API Documentation](../docs/API.md)
- Check out the [Quick Start Guide](../docs/QUICKSTART.md)
- Integrate into your own project

