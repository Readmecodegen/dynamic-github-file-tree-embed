import { getFileIcon } from "./file-icons";

export interface GitHubTreeNode {
  path: string;
  type: "blob" | "tree";
}

export interface TreeItem {
  id: string;
  name: string;
  type: "file" | "folder";
  children?: TreeItem[];
  path: string;
}

export interface SVGRenderOptions {
  repoName: string;
  owner: string;
  maxDepth: number;
  foldersOnly: boolean;
  includeHidden: boolean;
  skippedIds: Set<string>;
  theme: string;
  style: string;
  fontSizeParam: number;
  transparentBg: boolean;
  showHeader: boolean;
  showBorder: boolean;
  showFileIcons: boolean;
  avatarBase64: string;
  isTruncated: boolean;
}

interface RenderNode {
  item: TreeItem;
  depth: number;
  index: number;
  isLast: boolean;
  parentLines: boolean[];
  isTruncatedIndicator?: boolean;
}

interface FlattenOpts {
  maxDepth: number;
  foldersOnly: boolean;
  includeHidden: boolean;
  skippedIds: Set<string>;
}

// builds a nested tree from github's flat tree response
const buildNestedTree = (flatTree: GitHubTreeNode[], repoName: string): TreeItem => {
  const root: TreeItem = { id: "root", name: repoName, type: "folder", path: "", children: [] };
  const pathMap: Record<string, TreeItem> = { "": root };

  for (const item of flatTree) {
    const parts = item.path.split("/");
    let currPath = "";
    let parent = root;

    for (let i = 0; i < parts.length; i++) {
      currPath = currPath ? `${currPath}/${parts[i]}` : parts[i];
      if (!pathMap[currPath]) {
        const isLeaf = i === parts.length - 1 && item.type === "blob";
        const node: TreeItem = {
          id: currPath,
          name: parts[i],
          type: isLeaf ? "file" : "folder",
          path: currPath,
          children: isLeaf ? undefined : [],
        };
        parent.children?.push(node);
        if (!isLeaf) pathMap[currPath] = node;
      }
      parent = pathMap[currPath];
    }
  }
  return root;
};

// flattens nested tree into a render-ready list with depth/connector metadata
function flattenTreeForSVG(
  item: TreeItem,
  opts: FlattenOpts,
  depth = 0,
  isLast = true,
  parentLines: boolean[] = [],
  result: RenderNode[] = []
): RenderNode[] {
  if (opts.skippedIds.has(item.id)) return result;
  if (!opts.includeHidden && item.name.startsWith(".")) return result;
  if (opts.foldersOnly && item.type === "file") return result;
  if (opts.maxDepth > 0 && depth > opts.maxDepth) return result;

  result.push({ item, depth, index: result.length, isLast, parentLines });

  if (item.type === "folder" && item.children) {
    const visible = item.children.filter((c) => {
      if (opts.skippedIds.has(c.id)) return false;
      if (!opts.includeHidden && c.name.startsWith(".")) return false;
      if (opts.foldersOnly && c.type === "file") return false;
      return true;
    });

    const childDepth = depth + 1;
    if (opts.maxDepth > 0 && childDepth > opts.maxDepth) {
      if (visible.length > 0) {
        result.push({
          item: { ...item, name: "...", type: "file" },
          depth: childDepth,
          index: result.length,
          isLast: true,
          parentLines: [...parentLines, !isLast],
          isTruncatedIndicator: true,
        });
      }
    } else {
      for (let i = 0; i < visible.length; i++) {
        flattenTreeForSVG(
          visible[i],
          opts,
          childDepth,
          i === visible.length - 1,
          [...parentLines, !isLast],
          result
        );
      }
    }
  }

  return result;
}

const ICONS = {
  folder:
    '<path d="M4 20h16a2 2 0 0 0 2-2V8a2 2 0 0 0-2-2h-7.93a2 2 0 0 1-1.66-.9l-.82-1.2A2 2 0 0 0 7.93 3H4a2 2 0 0 0-2 2v13c0 1.1.9 2 2 2Z" fill="currentColor" stroke="none"/>',
  file:
    '<path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/><polyline points="14 2 14 8 20 8" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>',
};

const escapeXml = (s: string) =>
  s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");

export function generateFileTreeSvg(flatTree: GitHubTreeNode[], opts: SVGRenderOptions): string {
  const {
    repoName, owner, maxDepth, foldersOnly, includeHidden, skippedIds,
    theme, style, fontSizeParam, transparentBg, showHeader, showBorder,
    showFileIcons, avatarBase64, isTruncated,
  } = opts;

  const nodes = flattenTreeForSVG(
    buildNestedTree(flatTree, repoName),
    { maxDepth, foldersOnly, includeHidden, skippedIds }
  );

  // theme tokens
  const isDark          = theme === "dark";
  const bgColor         = isDark ? "#0d1117" : "#ffffff";
  const fgColor         = isDark ? "#c9d1d9" : "#24292f";
  const lineColor       = isDark ? "#30363d" : "#d0d7de";
  const iconColorFolder = isDark ? "#79c0ff" : "#0969da";
  const iconColorFile   = isDark ? "#8b949e" : "#24292f";

  // layout — all values scaled relative to font size
  const FONT_SIZE      = isNaN(fontSizeParam) ? 16 : Math.max(10, Math.min(24, fontSizeParam));
  const scale          = FONT_SIZE / 14;
  const HEADER_HEIGHT  = Math.round(30 * scale);
  const PADDING_X      = 40;
  const PADDING_Y      = 40 + HEADER_HEIGHT;
  const PADDING_BOTTOM = 40;
  const ROW_HEIGHT     = Math.round(28 * scale);
  const INDENT         = Math.round(24 * scale);
  const ICON_SIZE      = Math.round(16 * scale);

  const computedHeight = Math.max(100, nodes.length * ROW_HEIGHT + PADDING_Y + PADDING_BOTTOM);
  const computedWidth  = 800;

  // separate arrays so lines always render beneath icons and text
  const svgLines: string[] = [];
  const svgIcons: string[] = [];
  const svgTexts: string[] = [];

  // pass 1 — vertical connector lines.

  for (let ni = 0; ni < nodes.length; ni++) {
    const node    = nodes[ni];
    if (node.depth === 0) continue;

    const centerY   = PADDING_Y + node.index * ROW_HEIGHT + ROW_HEIGHT / 2;
    const lineStartY = centerY - ROW_HEIGHT / 2;
    const parentX   = PADDING_X + (node.depth - 1) * INDENT + 8;

    if (!node.isLast) {
      // find the centerY of the next sibling at the same depth
      let nextSiblingCenterY = centerY + ROW_HEIGHT;
      for (let i = ni + 1; i < nodes.length; i++) {
        if (nodes[i].depth < node.depth) break;
        if (nodes[i].depth === node.depth) {
          nextSiblingCenterY = PADDING_Y + nodes[i].index * ROW_HEIGHT + ROW_HEIGHT / 2;
          break;
        }
      }
      svgLines.push(
        `<line x1="${parentX}" y1="${lineStartY}" x2="${parentX}" y2="${nextSiblingCenterY}" class="tree-line" stroke-width="1.5"/>`
      );
    } else {
      // last child — line only reaches this node's centerY
      svgLines.push(
        `<line x1="${parentX}" y1="${lineStartY}" x2="${parentX}" y2="${centerY}" class="tree-line" stroke-width="1.5"/>`
      );
    }

    // horizontal arm from column line to just before the icon
    const x = PADDING_X + node.depth * INDENT;
    svgLines.push(
      `<line x1="${parentX}" y1="${centerY}" x2="${x - 4}" y2="${centerY}" class="tree-line" stroke-width="1.5"/>`
    );
  }

  // pass 2 — icons and text on top of lines
  for (const node of nodes) {
    const y       = PADDING_Y + node.index * ROW_HEIGHT;
    const x       = PADDING_X + node.depth * INDENT;
    const centerY = y + ROW_HEIGHT / 2;

    let textX = x;
    if (!node.isTruncatedIndicator && style !== "ascii") {
      const isFolder = node.item.type === "folder";
      let iconInner = isFolder ? ICONS.folder : ICONS.file;
      let color = isFolder ? iconColorFolder : iconColorFile;

      if (!isFolder && showFileIcons) {
        const specificIcon = getFileIcon(node.item.name);
        if (specificIcon) {
          iconInner = specificIcon;
          color = iconColorFile;
        }
      }

      svgIcons.push(
        `<g transform="translate(${x},${centerY - ICON_SIZE / 2})" color="${color}">` +
        `<svg width="${ICON_SIZE}" height="${ICON_SIZE}" viewBox="0 0 24 24">${iconInner}</svg></g>`
      );
      textX += ICON_SIZE + Math.round(6 * scale);
    }

    const textClass = node.isTruncatedIndicator
      ? "tree-text-file"
      : node.item.type === "folder"
      ? "tree-text-folder"
      : "tree-text-file";

    svgTexts.push(
      `<text x="${textX}" y="${centerY}" dominant-baseline="central"` +
      ` class="${textClass}"${node.isTruncatedIndicator ? ' font-style="italic"' : ""}>${escapeXml(node.item.name)}</text>`
    );
  }

  // truncation warning appended below the last row
  if (isTruncated) {
    const wy = PADDING_Y + nodes.length * ROW_HEIGHT + ROW_HEIGHT / 2;
    svgTexts.push(
      `<text x="${PADDING_X}" y="${wy}" dominant-baseline="central" class="tree-text-file" font-style="italic">⚠ Tree truncated — repo too large for full display</text>`
    );
  }

  // adaptive media queries only emitted for transparent-background svgs
  const mediaQueries = transparentBg
    ? `@media (prefers-color-scheme: dark) {
      .tree-text-folder { fill: #79c0ff; font-weight: bold; }
      .tree-text-file   { fill: #c9d1d9; }
      .tree-header-text { fill: #c9d1d9; }
    }
    @media (prefers-color-scheme: light) {
      .tree-text-folder { fill: #0969da; font-weight: bold; }
      .tree-text-file   { fill: #24292f; }
      .tree-header-text { fill: #24292f; }
    }`
    : "";

  const bgRect =
    transparentBg && !showBorder
      ? ""
      : `  <rect width="100%" height="100%" fill="${transparentBg ? "transparent" : bgColor}" rx="8"` +
        (showBorder ? ` stroke="${lineColor}" stroke-width="1.5"` : "") +
        "/>";

  const parts: string[] = [
    `<svg xmlns="http://www.w3.org/2000/svg" width="${computedWidth}" height="${computedHeight}">`,
    `  <style>`,
    `    text { font-family: ui-monospace, SFMono-Regular, Consolas, "Liberation Mono", Menlo, monospace; font-size: ${FONT_SIZE}px; }`,
    `    .tree-text-folder { fill: ${iconColorFolder}; font-weight: bold; }`,
    `    .tree-text-file   { fill: ${iconColorFile}; }`,
    `    .tree-line        { stroke: ${lineColor}; }`,
    `    .tree-header-text { font-weight: bold; font-size: ${Math.round(FONT_SIZE * 1.1)}px; fill: ${fgColor}; }`,
    mediaQueries,
    `  </style>`,
    bgRect,
    `  <g>`,
    ...svgLines,
    ...svgIcons,
    ...svgTexts,
    `  </g>`,
  ];

  // header: circular avatar + "owner / repo" label, OR default text
  const headerY    = Math.round(30 * scale);
  let headerX      = PADDING_X;

  if (showHeader) {
    const avatarSize = Math.round(28 * scale);

    if (avatarBase64) {
      parts.push(
        `  <clipPath id="avatar-clip"><circle cx="${headerX + avatarSize / 2}" cy="${headerY}" r="${avatarSize / 2}"/></clipPath>`,
        `  <image x="${headerX}" y="${headerY - avatarSize / 2}" width="${avatarSize}" height="${avatarSize}" href="${avatarBase64}" clip-path="url(#avatar-clip)" preserveAspectRatio="xMidYMid slice"/>`
      );
      headerX += avatarSize + Math.round(12 * scale);
    }

    parts.push(
      `  <text x="${headerX}" y="${headerY}" dominant-baseline="central" class="tree-header-text">${escapeXml(owner)} / ${escapeXml(repoName)}</text>`
    );
  } else {
    parts.push(
      `  <text x="${headerX}" y="${headerY}" dominant-baseline="central" class="tree-header-text">File Tree Structure</text>`
    );
  }

  parts.push("</svg>");
  return parts.join("\n");
}
