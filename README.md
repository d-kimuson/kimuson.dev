# kimuson.dev

Personal blog site built with Next.js and TypeScript.

## Tech Stack

- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Package Manager**: pnpm
- **Monorepo**: Turbo

## Project Structure

```
.
├── apps/
│   └── blog/          # Next.js blog application
├── packages/
│   ├── articles/      # Article management package
│   └── tsconfig/      # Shared TypeScript configuration
└── CLAUDE.md          # Development guide (Japanese)
```

## Getting Started

```bash
# Install dependencies
pnpm install

# Start development server
pnpm dev

# Build all packages
pnpm build

# Run type checking
pnpm typecheck

# Run linting
pnpm lint

# Fix linting issues
pnpm fix
```

## Development

See [CLAUDE.md](./CLAUDE.md) for detailed development guidelines and commands (in Japanese).
