# dynamic-github-file-tree-embed by Readmecodegen

# 🌳 Dynamic GitHub File Tree Embed

> Instantly generate beautiful, live-updating SVG file trees for your GitHub READMEs without any manual formatting.

[![GitHub License](https://img.shields.io/badge/license-MIT-blue.svg)](LICENSE)
[![Next.js](https://img.shields.io/badge/Built_with-Next.js-black?logo=next.js)](https://nextjs.org/)

Tired of manually typing out ASCII characters to show your project's folder structure in your README? **Dynamic GitHub File Tree Embed** fetches your repository's structure in real-time and renders a pixel-perfect, highly customizable SVG image that you can drop directly into any Markdown file!

---

## ✨ Features

- **Live & Dynamic**: Automatically syncs with your GitHub repository—no need to update your README when you add or delete files.
- **Auto-Theming**: Supports transparent backgrounds that automatically switch between Dark Mode and Light Mode text based on the viewer's system OS.
- **Highly Customizable**: Show/hide hidden files, limit depth, exclude specific folders (like `node_modules`), or show only directories.
- **Premium Design**: Beautiful, responsive layout with native Lucide icons for files and folders.
- **Zero Dependencies**: Just paste a single `![alt](url)` markdown image link into your README.

---

## 🚀 Quick Start

Drop this markdown line into your GitHub README:

```markdown
![Dynamic File Tree](https://www.readmecodegen.com/api/file-tree-embed?repo=facebook/react)
```

*(Just replace `facebook/react` with your own `owner/repo`!)*

---

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
| `style` | `string` | `ascii` | `ascii` (default icons) or `emoji` (rendered with GitHub emojis). |
| `fontSize` | `number` | `18` | Base font size for the rendered text. |

---

## 🎨 Examples

### 1. Transparent Adaptive Mode (Recommended)
This tree removes the background color and intelligently swaps its text color based on the reader's system theme.

```markdown
![My File Tree](https://www.readmecodegen.com/api/file-tree-embed?repo=your/repo&transparentBg=true)
```

### 2. Hide Clutter & Limit Depth
Perfect for large mono-repos where you only want to show the top-level architecture.

```markdown
![My File Tree](https://www.readmecodegen.com/api/file-tree-embed?repo=your/repo&maxDepth=2&exclude=node_modules,public,dist)
```

### 3. Light Mode, Folders Only
Keep it high-level by stripping out files entirely.

```markdown
![My File Tree](https://www.readmecodegen.com/api/file-tree-embed?repo=your/repo&theme=light&foldersOnly=true)
```

---

## ⚙️ How It Works

1. You embed a standard Markdown image link in your `README.md`.
2. GitHub's image proxy requests the SVG from our API.
3. We securely fetch your repository's Git Tree via the GitHub REST API.
4. We generate a perfectly aligned, visually stunning SVG file on the fly and deliver it back to the reader!

---

Built with ❤️ by the ReadmeCodeGen team.
[Generate your own visually stunning READMEs at readmecodegen.com!](https://readmecodegen.vercel.app)


