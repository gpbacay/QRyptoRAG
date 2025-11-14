# Contributing to qr-video-rag

First off, thank you for considering contributing to qr-video-rag! 🎉

It's people like you that make qr-video-rag such a great tool for the community.

## Code of Conduct

This project and everyone participating in it is governed by our Code of Conduct. By participating, you are expected to uphold this code. Please report unacceptable behavior to gpbacay@users.noreply.github.com.

## How Can I Contribute?

### Reporting Bugs

Before creating bug reports, please check the issue list as you might find out that you don't need to create one. When you are creating a bug report, please include as many details as possible:

* **Use a clear and descriptive title**
* **Describe the exact steps which reproduce the problem**
* **Provide specific examples to demonstrate the steps**
* **Describe the behavior you observed after following the steps**
* **Explain which behavior you expected to see instead and why**
* **Include error messages and stack traces**

**Bug Report Template:**

```markdown
## Description
[A clear description of the bug]

## Steps to Reproduce
1. [First step]
2. [Second step]
3. [And so on...]

## Expected Behavior
[What you expected to happen]

## Actual Behavior
[What actually happened]

## Environment
- Node.js version: 
- npm/yarn version: 
- OS: 
- qr-video-rag version: 
```

### Suggesting Enhancements

Enhancement suggestions are tracked as GitHub issues. When creating an enhancement suggestion, please include:

* **Use a clear and descriptive title**
* **Provide a step-by-step description of the suggested enhancement**
* **Provide specific examples to demonstrate the steps**
* **Describe the current behavior and explain the behavior you expected**
* **Explain why this enhancement would be useful**

### Pull Requests

* Fill in the required template
* Do not include issue numbers in the PR title
* Follow the TypeScript styleguide
* Include thoughtfully-worded, well-structured tests
* Document new code
* End all files with a newline

## Development Setup

### Prerequisites

* Node.js >= 18.0.0
* npm or yarn
* Git

### Setting Up Your Development Environment

1. **Fork the repository**

   Click the "Fork" button in the top-right corner of the repository page.

2. **Clone your fork**

   ```bash
   git clone https://github.com/YOUR-USERNAME/qr-video-rag.git
   cd qr-video-rag
   ```

3. **Install dependencies**

   ```bash
   npm install
   ```

4. **Create a branch**

   ```bash
   git checkout -b feature/your-feature-name
   # or
   git checkout -b fix/your-bug-fix
   ```

5. **Make your changes**

   Write your code, tests, and documentation.

6. **Build and test**

   ```bash
   # Build the project
   npm run build

   # Run tests
   npm test

   # Lint your code
   npm run lint

   # Format your code
   npm run format
   ```

7. **Commit your changes**

   ```bash
   git add .
   git commit -m "feat: add amazing new feature"
   ```

   We follow [Conventional Commits](https://www.conventionalcommits.org/):
   - `feat:` A new feature
   - `fix:` A bug fix
   - `docs:` Documentation only changes
   - `style:` Code style changes (formatting, etc)
   - `refactor:` Code refactoring
   - `perf:` Performance improvements
   - `test:` Adding or updating tests
   - `chore:` Maintenance tasks

8. **Push to your fork**

   ```bash
   git push origin feature/your-feature-name
   ```

9. **Create a Pull Request**

   Go to the original repository and click "New Pull Request".

## Styleguides

### TypeScript Styleguide

* Use TypeScript for all new code
* Follow the existing code style
* Use meaningful variable and function names
* Add JSDoc comments for public APIs
* Use `async/await` instead of callbacks
* Prefer `const` over `let`
* Use template literals for string interpolation

Example:

```typescript
/**
 * Generate QR code from text
 * 
 * @param text - Text to encode
 * @param options - QR code options
 * @returns Buffer containing PNG image
 */
async function generateQrCode(
  text: string,
  options?: QrCodeOptions
): Promise<Buffer> {
  // Implementation
}
```

### Git Commit Messages

* Use the present tense ("Add feature" not "Added feature")
* Use the imperative mood ("Move cursor to..." not "Moves cursor to...")
* Limit the first line to 72 characters or less
* Reference issues and pull requests liberally after the first line

### Documentation Styleguide

* Use [Markdown](https://guides.github.com/features/mastering-markdown/)
* Reference function/class names in backticks: `QRVideoStoreEncoder`
* Include code examples where appropriate
* Keep line length to 100 characters when possible

## Testing

### Writing Tests

* Place test files in the `tests/` directory
* Use descriptive test names
* Test both success and failure cases
* Mock external dependencies

Example:

```typescript
describe('QRVideoStoreEncoder', () => {
  describe('chunkText', () => {
    it('should split text into chunks of specified size', () => {
      const encoder = new QRVideoStoreEncoder(mockDb, mockEmbedder);
      const chunks = encoder.chunkText('a'.repeat(1000));
      
      expect(chunks.length).toBeGreaterThan(1);
      expect(chunks[0].text.length).toBeLessThanOrEqual(500);
    });

    it('should handle empty text', () => {
      const encoder = new QRVideoStoreEncoder(mockDb, mockEmbedder);
      const chunks = encoder.chunkText('');
      
      expect(chunks.length).toBe(0);
    });
  });
});
```

### Running Tests

```bash
# Run all tests
npm test

# Run tests in watch mode
npm run test:watch

# Run tests with coverage
npm test -- --coverage
```

## Project Structure

```
qr-video-rag/
├── src/
│   ├── adapters/          # Database and embedder adapters
│   ├── encoder.ts         # QRVideoStoreEncoder class
│   ├── retriever.ts       # QRVideoStoreRetriever class
│   ├── types.ts           # TypeScript type definitions
│   └── index.ts           # Main entry point
├── tests/                 # Test files
├── examples/              # Usage examples
├── docs/                  # Documentation
├── bin/                   # CLI scripts
└── dist/                  # Compiled output (generated)
```

## Adding New Features

### Adding a New Database Adapter

1. Create adapter in `src/adapters/database.ts`
2. Implement the `VectorDatabase` interface
3. Export from `src/adapters/index.ts`
4. Add tests in `tests/adapters/database.test.ts`
5. Document in `docs/API.md`
6. Add example in `examples/`

### Adding a New Embedder Adapter

1. Create adapter in `src/adapters/embedders.ts`
2. Implement the `Embedder` interface
3. Export from `src/adapters/index.ts`
4. Add tests in `tests/adapters/embedders.test.ts`
5. Document in `docs/API.md`
6. Add example in `examples/`

## Release Process

(For maintainers only)

1. Update version in `package.json`
2. Update `CHANGELOG.md`
3. Commit changes: `git commit -am "chore: release v1.x.x"`
4. Create tag: `git tag v1.x.x`
5. Push: `git push && git push --tags`
6. GitHub Actions will automatically publish to npm

## Questions?

Feel free to open an issue with the `question` label, or reach out to the maintainers.

## Attribution

This contributing guide is adapted from the [Atom contributing guide](https://github.com/atom/atom/blob/master/CONTRIBUTING.md).

---

Thank you for contributing! 🙏

