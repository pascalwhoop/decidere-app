---
name: release
description: >
  Creates a production release for the Decidere salary calculator: analyses changes since the last
  tag, generates the changelog entry, suggests a version bump (patch/minor/major) with reasoning,
  bumps package.json, commits, tags, and pushes — triggering GitHub Actions to create a GitHub
  release. Use when asked to "cut a release", "release this", "make a release", "/release", or
  any similar request to publish a new version.
---

# Release Skill

## Pre-flight checks

```bash
git rev-parse --abbrev-ref HEAD   # must return "main"
git diff-index --quiet HEAD --    # must exit 0 (clean)
git pull origin main
```

Stop and explain if any check fails.

## Step 1: Analyse changes since last tag

```bash
LAST_TAG=$(git describe --tags --abbrev=0)
git log "$LAST_TAG..HEAD" --oneline
git diff --name-status "$LAST_TAG" HEAD -- configs/
git diff --stat "$LAST_TAG" HEAD -- src/
# Distinguish new countries from new year configs:
git ls-tree -r "$LAST_TAG" --name-only | grep "configs/.*/base.yaml" | sed 's|/[0-9]*/base.yaml||;s|configs/||' | sort -u
git ls-tree -r HEAD        --name-only | grep "configs/.*/base.yaml" | sed 's|/[0-9]*/base.yaml||;s|configs/||' | sort -u
# New vs modified variants:
git diff --name-status "$LAST_TAG" HEAD -- configs/ | grep "variants/"
```

Also read changed files in `src/` for user-visible UI/UX changes.

## Step 2: Suggest version bump (with reasoning)

| Bump | When |
|---|---|
| `major` | Breaking changes or complete architectural overhaul |
| `minor` | New countries, new variants, new tax year data, meaningful new features |
| `patch` | Fixes only, small UI tweaks, config corrections — no new countries or features |

Present a clear recommendation with a one-sentence justification, then ask the user to confirm or override before continuing. Example:

> **Suggested: minor** — 3 new countries added (Austria, Finland, Greece), 5 new expat variants.
> Type to confirm or override [minor]:

## Step 3: Compute the next version

```bash
CURRENT=$(node -p "require('./package.json').version")
```

Compute next version from bump type (e.g. `0.2.11` + `minor` → `0.3.0`, + `patch` → `0.2.12`).
Use this version number when writing the changelog JSON in the next step.

## Step 4: Generate changelog entry

Read `references/changelog-schema.md` for the full schema and classification rules.

1. Write `src/data/changelog/<next-version>.json`
2. Prepend import and entry to `src/data/changelog/index.ts` (read first, never overwrite)

## Step 5: Bump, commit, tag, push

```bash
npm version <patch|minor|major> --no-git-tag-version
NEW_VERSION=$(node -p "require('./package.json').version")

git add package.json package-lock.json src/data/changelog/
git commit -m "chore: release v$NEW_VERSION"
git tag -a "v$NEW_VERSION" -m "Release v$NEW_VERSION"
git push origin main
git push origin "v$NEW_VERSION"
```

The tag push triggers `release.yml` in GitHub Actions, which reads the changelog JSON and creates the GitHub release with formatted notes.

## Done

Confirm to the user: version released, GitHub Actions will create the release automatically, Cloudflare will deploy (it watches main continuously).
