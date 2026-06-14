# 🌳 Dynamic GitHub File Tree Embed

> Instantly generate beautiful, live-updating SVG file trees for your GitHub READMEs without any manual formatting.

[![GitHub License](https://img.shields.io/badge/license-MIT-blue.svg)](LICENSE)
[![Next.js](https://img.shields.io/badge/Built_with-Next.js-black?logo=next.js)](https://nextjs.org/)

[![Dynamic File Tree](https://www.readmecodegen.com/api/file-tree-embed?repo=Readmecodegen%2Fdynamic-github-file-tree-embed&branch=main&showHeader=true&showFileIcons=true&style=emoji)](https://github.com/Readmecodegen/dynamic-github-file-tree-embed)

## What is this and what problem does it solve?

If you maintain open-source projects, you've probably spent time manually typing out ASCII characters (like `├──` and `└──`) to map out your folder structure in your README. It looks great right up until you add a new file, move a folder, or restructure your app. Suddenly, your hardcoded tree is out of date, and fixing it is tedious.

**Dynamic GitHub File Tree Embed** solves this entirely. It is a live, auto-updating SVG image that you can drop straight into any Markdown file. 

Instead of typing out files manually, you paste one image link. We fetch your repository's actual structure in real-time and render a pixel-perfect, highly customizable file tree. When you push new code to GitHub, your README updates automatically!

## 📖 Table of Contents

- [What is this and what problem does it solve?](#what-is-this-and-what-problem-does-it-solve)
- [Features](#-features)
- [Quick Start](#-quick-start)
- [Configuration & Parameters](#️-configuration--parameters)
- [Examples](#-examples)
  - [1. The "Everything" View (Emoji Icons + Header + Border)](#1-the-everything-view-emoji-icons--header--border)
  - [2. Transparent Adaptive Mode](#2-transparent-adaptive-mode)
  - [3. Light Mode, Folders Only (High-Level View)](#3-light-mode-folders-only-high-level-view)
  - [4. Raw ASCII Mode + Hidden Files](#4-raw-ascii-mode--hidden-files)
- [Supported File Type Icons](#️-supported-file-type-icons)
- [Adding More File Type Icons](#-adding-more-file-type-icons)
  - [How it works](#how-it-works)
  - [Step-by-step](#step-by-step)
  - [Icon Examples](#icon-examples)
- [Caching & Instant Updates (Webhooks)](#-caching--instant-updates-webhooks)
- [How It Works](#️-how-it-works)
- [Contributing](#-contributing)
- [Wanted: More File Icons!](#-wanted-more-file-icons)
- [Try the Live Builder Tool](#-try-the-live-builder-tool)

## ✨ Features

- **Live & Dynamic**: Automatically syncs with your GitHub repository—no need to update your README when you add or delete files.
- **Auto-Theming**: Supports transparent backgrounds that automatically switch between Dark Mode and Light Mode text based on the viewer's system OS.
- **Highly Customizable**: Show/hide hidden files, limit depth, exclude specific folders (like `node_modules`), or show only directories.
- **Premium Design**: Beautiful, responsive layout with native Lucide icons for files and folders.
- **File Type Icons**: Color-coded, language-specific icons for 80+ file types (JS, TS, React, Python, Go, Rust, and more).
- **Zero Dependencies**: Just paste a single `![alt](url)` markdown image link into your README.

## 🚀 Quick Start

Drop this markdown line into your GitHub README:

```markdown
![Dynamic File Tree](https://www.readmecodegen.com/api/file-tree-embed?repo=facebook/react)
```

*(Just replace `facebook/react` with your own `owner/repo`!)*

## 🛠️ Configuration & Parameters

Customize your file tree by adding query parameters to the URL.

| Parameter | Type | Default | Description |
|-----------|------|---------|-------------|
| `repo` | `string` | **Required** | The GitHub repository in `owner/repo` format (e.g., `facebook/react`). |
| `branch` | `string` | `main` | Specify a branch, tag, or commit hash. |
| `maxDepth` | `number` | `0` (All) | Maximum folder depth to display. Folders beyond this depth are truncated. |
| `foldersOnly`| `boolean` | `false` | If `true`, hides all individual files and only renders directories. |
| `includeHidden`| `boolean`| `false` | If `true`, includes hidden files and folders (e.g., `.git`, `.env`). |
| `exclude` | `string` | `""` | Comma-separated list of exact paths to hide (e.g., `node_modules,dist`). |
| `theme` | `string` | `dark` | Visual theme: `dark` or `light`. |
| `transparentBg`| `boolean`| `false` | If `true`, removes the solid background. Text color dynamically adapts to the viewer's OS! |
| `showHeader` | `boolean` | `false` | If `true`, fetches and displays the owner's GitHub avatar and repository name at the top. |
| `showBorder` | `boolean` | `false` | If `true`, draws a neat 1px border around the entire tree. |
| `style` | `string` | `ascii` | `ascii` for connector lines only (no icons), or `emoji` to render file & folder icons. |
| `showFileIcons` | `boolean` | `false` | If `true`, replaces the generic file icon with a language/type-specific colored icon (e.g., React atom for `.tsx`, Python snake for `.py`). See note below. |
| `fontSize` | `number` | `16` | Base font size for the rendered text. |

> [!IMPORTANT]
> **`showFileIcons` requires `style=emoji`.**
> File icons (both the generic file icon and the specific language icons) are only rendered when `style=emoji` is set.
> In the default `ascii` mode, the tree uses connector lines (`├──`, `└──`) with **no icons at all**.
>
> ✅ Correct: `?style=emoji&showFileIcons=true`
> ❌ Has no effect: `?showFileIcons=true` (ascii mode — icons are suppressed)

## 🎨 Examples

Here are some real examples of how the file tree looks with different parameters. We use this very repository (`Readmecodegen/dynamic-github-file-tree-embed`) to generate these live previews!

### 1. The "Everything" View (Emoji Icons + Header + Border)
This example turns on the repository header, the outer border, bumps the font size up to `22`, and enables the premium file-type icons.

[![Example 1](https://www.readmecodegen.com/api/file-tree-embed?repo=Readmecodegen%2Fdynamic-github-file-tree-embed&branch=main&showHeader=true&showBorder=true&showFileIcons=true&style=emoji&fontSize=22)](https://github.com/Readmecodegen/dynamic-github-file-tree-embed)

```markdown
![My File Tree](https://www.readmecodegen.com/api/file-tree-embed?repo=Readmecodegen/dynamic-github-file-tree-embed&branch=main&showHeader=true&showBorder=true&showFileIcons=true&style=emoji&fontSize=22)
```

### 2. Transparent Adaptive Mode
This tree removes the background color entirely. The text color automatically swaps based on whether the reader is using Dark Mode or Light Mode on their system.

[![Example 2](https://www.readmecodegen.com/api/file-tree-embed?repo=Readmecodegen%2Fdynamic-github-file-tree-embed&transparentBg=true)](https://github.com/Readmecodegen/dynamic-github-file-tree-embed)

```markdown
![My File Tree](https://www.readmecodegen.com/api/file-tree-embed?repo=Readmecodegen/dynamic-github-file-tree-embed&transparentBg=true)
```

### 3. Light Mode, Folders Only (High-Level View)
Perfect for massive repositories. This example uses the `light` theme, limits the folder depth to `2`, excludes specific folders, and completely hides individual files to just show the architecture.

[![Example 3](https://www.readmecodegen.com/api/file-tree-embed?repo=Readmecodegen%2Fdynamic-github-file-tree-embed&theme=light&maxDepth=2&foldersOnly=true&exclude=node_modules,.git,public)](https://github.com/Readmecodegen/dynamic-github-file-tree-embed)

```markdown
![My File Tree](https://www.readmecodegen.com/api/file-tree-embed?repo=Readmecodegen/dynamic-github-file-tree-embed&theme=light&maxDepth=2&foldersOnly=true&exclude=node_modules,.git,public)
```

### 4. Raw ASCII Mode + Hidden Files
This is the default minimalist look. It shows standard ASCII connector lines instead of icons. We've also turned on `includeHidden` so you can see hidden dotfiles like `.gitignore` or `.env`.

[![Example 4](https://www.readmecodegen.com/api/file-tree-embed?repo=Readmecodegen%2Fdynamic-github-file-tree-embed&style=ascii&includeHidden=true)](https://github.com/Readmecodegen/dynamic-github-file-tree-embed)

```markdown
![My File Tree](https://www.readmecodegen.com/api/file-tree-embed?repo=Readmecodegen/dynamic-github-file-tree-embed&style=ascii&includeHidden=true)
```

## 🖼️ Supported File Type Icons

When `style=emoji&showFileIcons=true` is enabled, the following file types render with their official brand colors:

| Category | Extensions | Color |
|----------|------------|-------|
| **JavaScript** | `.js` | Yellow badge `#F7DF1E` |
| **TypeScript** | `.ts` | Blue badge `#3178C6` |
| **React JSX** | `.jsx` | Cyan atom icon `#61DAFB` |
| **React TSX** | `.tsx` | Cyan atom icon `#61DAFB` |
| **Vue** | `.vue` | Green chevron `#41B883` |
| **Python** | `.py` | Snake icon `#3776AB` |
| **JSON** | `.json` | Document outline with `{}` `#EAB308` |
| **HTML** | `.html` | HTML5 shield `#E34F26` |
| **CSS** | `.css` | CSS3 shield `#1572B6` |
| **Markdown** | `.md` | M↓ block icon |
| **Images** | `.jpg`, `.png`, `.svg` | Mountain/landscape icon `#10B981` |

Any file type **not** in this list will fall back to the default generic file icon — it will never appear empty.

## ➕ Adding More File Type Icons

Want to add an icon for a file type that's missing? It's a single-line change!

All icons live in [`src/app/api/file-tree-embed/file-icons.ts`](src/app/api/file-tree-embed/file-icons.ts).

### How it works

The file exports a plain `FILE_ICONS_MAP` object. Each key is a **lowercase file extension**, and the value is a **raw SVG string** that will be rendered inside a `0 0 24 24` viewBox.

### Step-by-step

1. Open `file-icons.ts`.
2. Add a new entry to `FILE_ICONS_MAP` using the file extension as the key.
3. Set the value to the inner SVG content (no `<svg>` wrapper needed — just paths, rects, circles, text, etc.).
4. Save the file — **no other changes needed.** The renderer picks it up automatically.

### Icon Examples

**Colored badge with abbreviation** (easiest pattern for new languages):
```typescript
// A cyan square badge with "GO" text — for .go files
go: '<rect x="3" y="3" width="18" height="18" rx="2" ry="2" fill="#00ADD8"/>' +
    '<text x="12" y="16.5" font-size="11" font-family="sans-serif" font-weight="bold" fill="white" text-anchor="middle">GO</text>',
```

**Custom SVG path** (for logos with a distinctive shape):
```typescript
// Rust crab-wheel logo for .rs files
rs: '<path d="M12 2 ..." fill="#CE422B"/>',
```

**Image/document style** (outline with inner detail):
```typescript
// JSON document outline with {} label
json: '<path d="M14.5 2H6a2 2 0 0 0-2 2v16..." fill="none" stroke="#EAB308" stroke-width="2"/>' +
      '<text x="12" y="16" font-size="6" font-family="monospace" fill="#EAB308" text-anchor="middle">{}</text>',
```

> [!TIP]
> Keep the viewBox coordinate space in mind: icons render at `0 0 24 24`. Coordinates like `x="3"` and `width="18"` leave a 3-unit margin on each side, which looks best at small sizes.

## ⚡ Caching & Instant Updates (Webhooks)

To protect GitHub API limits, our servers **automatically cache your file tree for 1 hour**. This means that if you add or delete a file in your repository, it may take up to an hour for your README image to update.

**Want instant updates?** You do NOT need to enable any special toggles! Just set up a GitHub Webhook on your repository to instantly clear the cache whenever you push code.

### How to set up the Webhook (Pros & Cons)
**Pros**: Your README image will update instantly when you push code. Zero API limits hit.
**Cons**: Requires 1 minute to configure in your GitHub settings.

1. Go to your GitHub Repository ➔ **Settings** ➔ **Webhooks** ➔ **Add webhook**.
2. **Payload URL**: `https://readmecodegen.com/api/webhook/github-tree`
3. **Content type**: `application/json`
4. **Which events**: Just the `push` event.
5. Click **Add webhook**.

That's it! Now, every time you push code, GitHub pings our server, and we instantly wipe the 1-hour cache for your specific repository. The very next person to view your README will see the freshly generated SVG!

## ⚙️ How It Works

1. You embed a standard Markdown image link in your `README.md`.
2. GitHub's image proxy requests the SVG from our API.
3. We securely fetch your repository's Git Tree via the GitHub REST API.
4. We generate a perfectly aligned, visually stunning SVG file on the fly and deliver it back to the reader!

## 🤝 Contributing

We would love your help to make this tool even better! 
If you find a bug, have a feature request, or just want to contribute:
- **[Open an Issue](https://github.com/Sonucs12/readmecodegen/issues)**: Report bugs or suggest new features.
- **Fork the Repo**: Feel free to fork the repository and submit a Pull Request!
- **⭐️ Star the Project**: If you use this tool in your README, please consider giving the repository a star to support its development!

## 🎯 Wanted: More File Icons!

We currently have icons for **12 file types**. There are hundreds of languages and tools out there — and we'd love your help growing this list!

### Missing icons we'd love to see

| Extension | Language / Tool |
|-----------|----------------|
| `.go` | Go |
| `.rs` | Rust |
| `.rb` | Ruby |
| `.php` | PHP |
| `.java` | Java |
| `.kt` | Kotlin |
| `.swift` | Swift |
| `.dart` | Dart |
| `.cs` | C# |
| `.cpp` | C++ |
| `.sh` | Shell / Bash |
| `.yaml` / `.yml` | YAML |
| `.toml` | TOML |
| `.dockerfile` | Docker |
| `.tf` | Terraform |
| `.graphql` | GraphQL |
| `.sql` | SQL |
| `.zip` / `.tar` | Archives |
| ... and many more! | |

### How to contribute an icon

1. Fork the repo and open [`src/app/api/file-tree-embed/file-icons.ts`](src/app/api/file-tree-embed/file-icons.ts).
2. Add one line to `FILE_ICONS_MAP` — the key is the extension, the value is raw SVG inner content (24×24 viewBox).
3. **Preview your icon** — open the **[Live Icon Preview Tool](https://readmecodegen.github.io/dynamic-github-file-tree-embed/icon-preview.html)**, paste your SVG string, and see it rendered at all sizes and in both light/dark mode before submitting.
4. Open a Pull Request with a title like `feat: add .go icon` — we'll merge it fast!

> [!NOTE]
> Even a simple **colored badge with the extension abbreviation** is a great contribution. Perfect doesn't have to be the enemy of done!

## 🌐 Try the Live Builder Tool

Don't want to write the URL parameters manually? We have a visual builder!

👉 **[Try the Dynamic File Tree Embed Builder here!](https://readmecodegen.com/file-tree/dynamic-github-file-tree-embed)**

Built with ❤️ by the ReadmeCodeGen team.
[Generate your own visually stunning READMEs at readmecodegen.com!](https://readmecodegen.com)
