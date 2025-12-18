# Publishing Guide

This document explains how to publish the `resume-layout-engine` package to npm.

## Prerequisites

1. You need an npm account. Create one at https://www.npmjs.com/signup if you don't have one.
2. Make sure you're logged in to npm in your terminal.

## First Time Publishing

### 1. Login to npm

```bash
npm login
```

Enter your username, password, and email when prompted.

### 2. Verify the package build

The build happens automatically before publishing (via `prepublishOnly` script), but you can verify it manually:

```bash
npm run build:lib
```

This creates the `dist/` folder with compiled JavaScript and TypeScript declaration files.

### 3. Check what will be published

```bash
npm publish --dry-run
```

This shows you exactly what files will be included in the package.

### 4. Publish to npm

```bash
npm publish
```

That's it! Your package will be available at https://www.npmjs.com/package/resume-layout-engine

## Publishing Updates

### 1. Update the version

Follow [Semantic Versioning](https://semver.org/):

```bash
# For bug fixes (1.0.0 -> 1.0.1)
npm version patch

# For new features (1.0.0 -> 1.1.0)
npm version minor

# For breaking changes (1.0.0 -> 2.0.0)
npm version major
```

This automatically:
- Updates `package.json`
- Creates a git commit
- Creates a git tag

### 2. Push to GitHub

```bash
git push origin main
git push origin --tags
```

### 3. Publish to npm

```bash
npm publish
```

## Alternative: Scoped Package

If the name `resume-layout-engine` is already taken, you can publish as a scoped package:

1. Update `package.json`:
   ```json
   {
     "name": "@arunjnext/resume-layout-engine"
   }
   ```

2. Publish with public access:
   ```bash
   npm publish --access public
   ```

## Verification

After publishing, verify your package:

1. Visit https://www.npmjs.com/package/resume-layout-engine
2. Test installation in a new project:
   ```bash
   mkdir test-install
   cd test-install
   npm init -y
   npm install resume-layout-engine
   ```

3. Test the import:
   ```javascript
   import { ResumeLayoutEngine } from 'resume-layout-engine';
   console.log(ResumeLayoutEngine);
   ```

## Troubleshooting

### "You do not have permission to publish"

The package name might be taken. Try:
- Using a scoped package: `@arunjnext/resume-layout-engine`
- Choosing a different name

### "402 Payment Required"

Your npm account needs to be verified. Check your email and verify your account.

### Build fails

Make sure TypeScript compiles without errors:
```bash
npm run build:lib
```

## Files Included in Package

The `.npmignore` file controls what's published. Currently includes:
- `dist/` - Compiled JavaScript and type definitions
- `README.md` - Documentation
- `LICENSE` - License file
- `package.json` - Package metadata

## Files Excluded from Package

- `src/` - Original demo code
- `lib/` - TypeScript source files
- `examples/` - Example projects
- `docs/` - Additional documentation
- Development files (config files, etc.)

