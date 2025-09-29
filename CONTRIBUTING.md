# Contributing to PayStation SDK

## Development Setup

1. Clone the repository:
```bash
git clone https://github.com/ain477/paystation.git
cd paystation
```

2. Install dependencies:
```bash
npm install
```

3. Run tests:
```bash
npm test
```

4. Build the package:
```bash
npm run build
```

## Release Process

This project uses automated publishing via GitHub Actions. Here's how it works:

### Automatic Publishing

- **Trigger**: Push to `main` branch
- **Condition**: Only publishes if the version in `package.json` has changed
- **Process**: 
  1. Runs tests and type checking
  2. Builds the package
  3. Publishes to npm
  4. Creates a GitHub release

### Manual Release

Use the release script for easy version bumping:

```bash
# Patch release (1.0.0 -> 1.0.1)
./scripts/release.sh patch

# Minor release (1.0.0 -> 1.1.0)
./scripts/release.sh minor

# Major release (1.0.0 -> 2.0.0)
./scripts/release.sh major
```

The script will:
1. Ensure you're on the main branch
2. Pull latest changes
3. Run tests and type checking
4. Build the package
5. Bump the version
6. Commit and push the changes
7. Create and push a git tag
8. Trigger automatic publishing via GitHub Actions

### GitHub Secrets Required

For automatic publishing to work, the following secrets must be set in the GitHub repository:

1. **NPM_TOKEN**: Your npm authentication token
   - Go to https://www.npmjs.com/settings/tokens
   - Create a new "Automation" token
   - Add it as a repository secret

2. **GITHUB_TOKEN**: Automatically provided by GitHub Actions

### Setting up NPM_TOKEN

1. Go to [npm tokens page](https://www.npmjs.com/settings/tokens)
2. Click "Generate New Token" → "Classic Token"
3. Select "Automation" type
4. Copy the token
5. Go to your GitHub repository → Settings → Secrets and variables → Actions
6. Click "New repository secret"
7. Name: `NPM_TOKEN`
8. Value: Paste your npm token
9. Click "Add secret"

## Workflow Files

- `.github/workflows/publish.yml`: Handles automatic publishing to npm
- `.github/workflows/ci.yml`: Runs tests on pull requests and non-main branches

## Testing

- `npm test`: Run all tests
- `npm run test:watch`: Run tests in watch mode
- `npm run type-check`: Run TypeScript type checking

## Building

- `npm run build`: Build the package for production
- `npm run dev`: Build in watch mode for development