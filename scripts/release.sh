#!/bin/bash

# Release script for PayStation SDK
# Usage: ./scripts/release.sh [patch|minor|major]

set -e

# Default to patch if no argument provided
RELEASE_TYPE=${1:-patch}

echo "🚀 Starting release process..."
echo "📦 Release type: $RELEASE_TYPE"

# Make sure we're on main branch
CURRENT_BRANCH=$(git branch --show-current)
if [ "$CURRENT_BRANCH" != "main" ]; then
    echo "❌ Error: You must be on the main branch to release"
    echo "Current branch: $CURRENT_BRANCH"
    exit 1
fi

# Make sure working directory is clean
if [ -n "$(git status --porcelain)" ]; then
    echo "❌ Error: Working directory is not clean"
    echo "Please commit or stash your changes first"
    git status --short
    exit 1
fi

# Pull latest changes
echo "📥 Pulling latest changes..."
git pull origin main

# Run tests
echo "🧪 Running tests..."
npm test

# Run type check
echo "🔍 Running type check..."
npm run type-check

# Build package
echo "🔨 Building package..."
npm run build

# Get current version
CURRENT_VERSION=$(node -p "require('./package.json').version")
echo "📋 Current version: $CURRENT_VERSION"

# Bump version
echo "⬆️  Bumping version..."
npm version $RELEASE_TYPE --no-git-tag-version

# Get new version
NEW_VERSION=$(node -p "require('./package.json').version")
echo "🎯 New version: $NEW_VERSION"

# Update CHANGELOG.md
echo "📝 Updating CHANGELOG.md..."
sed -i '' "s/## \[Unreleased\]/## [Unreleased]\n\n## [$NEW_VERSION] - $(date +%Y-%m-%d)/" CHANGELOG.md 2>/dev/null || true

# Commit version bump
echo "💾 Committing version bump..."
git add package.json package-lock.json CHANGELOG.md
git commit -m "chore: bump version to $NEW_VERSION"

# Create and push tag
echo "🏷️  Creating and pushing tag..."
git tag "v$NEW_VERSION"
git push origin main
git push origin "v$NEW_VERSION"

echo "✅ Release $NEW_VERSION completed!"
echo "🚀 GitHub Actions will automatically publish to npm"
echo "📦 Check the progress at: https://github.com/ain477/paystation/actions"