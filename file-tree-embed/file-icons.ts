export const FILE_ICONS_MAP: Record<string, string> = {
  js: '<rect x="3" y="3" width="18" height="18" rx="2" ry="2" fill="#F7DF1E"/><text x="12" y="16.5" font-size="11" font-family="sans-serif" font-weight="bold" fill="black" text-anchor="middle">JS</text>',
  ts: '<rect x="3" y="3" width="18" height="18" rx="2" ry="2" fill="#3178C6"/><text x="12" y="16.5" font-size="11" font-family="sans-serif" font-weight="bold" fill="white" text-anchor="middle">TS</text>',
  jsx: '<circle cx="12" cy="12" r="2.5" fill="#61DAFB"/><ellipse cx="12" cy="12" rx="9" ry="3.5" fill="none" stroke="#61DAFB" stroke-width="1.5" transform="rotate(30 12 12)"/><ellipse cx="12" cy="12" rx="9" ry="3.5" fill="none" stroke="#61DAFB" stroke-width="1.5" transform="rotate(-30 12 12)"/><ellipse cx="12" cy="12" rx="9" ry="3.5" fill="none" stroke="#61DAFB" stroke-width="1.5" transform="rotate(90 12 12)"/>',
  tsx: '<circle cx="12" cy="12" r="2.5" fill="#61DAFB"/><ellipse cx="12" cy="12" rx="9" ry="3.5" fill="none" stroke="#61DAFB" stroke-width="1.5" transform="rotate(30 12 12)"/><ellipse cx="12" cy="12" rx="9" ry="3.5" fill="none" stroke="#61DAFB" stroke-width="1.5" transform="rotate(-30 12 12)"/><ellipse cx="12" cy="12" rx="9" ry="3.5" fill="none" stroke="#61DAFB" stroke-width="1.5" transform="rotate(90 12 12)"/>',
  vue: '<path d="M12 19.5L2 3h4.5L12 12.5 17.5 3H22L12 19.5z" fill="#41B883"/><path d="M12 12.5L7.5 3h-4L12 19.5 20.5 3h-4L12 12.5z" fill="#34495E"/>',
  py: '<path d="M12 2C8 2 8 5 8 5v2h8v2H6a2 2 0 0 0-2 2v3c0 2 2 2 2 2h2v-2c0-2 2-2 2-2h4a2 2 0 0 0 2-2V5c0-4-4-3-4-3zm-2 2a1 1 0 1 1 0 2 1 1 0 0 1 0-2zm10 7c0 2-2 2-2 2h-2v2c0 2-2 2-2 2H8s0 3 4 3 4-3 4-3v-2h2a2 2 0 0 0 2-2v-3c0-2-2-2-2-2h-2v2zm-4 4a1 1 0 1 1 0 2 1 1 0 0 1 0-2z" fill="#3776AB"/>',
  json: '<path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z" fill="none" stroke="#EAB308" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/><polyline points="14 2 14 8 20 8" fill="none" stroke="#EAB308" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/><text x="12" y="16" font-size="6" font-family="monospace" fill="#EAB308" text-anchor="middle" font-weight="bold">{}</text>',
  html: '<path d="M4 3h16l-1.5 14L12 20l-6.5-3L4 3zm7 11h3l-.3 3.3L12 18l-1.7-.7L10 14H8l.5 5 3.5 1 3.5-1 .5-6H8l-.5-4h7.5l.3-3H7.5L8 10h6.5l-.2 2H8l.5 2h2.5z" fill="#E34F26"/>',
  css: '<path d="M4 3h16l-1.5 14L12 20l-6.5-3L4 3zm3 3l.5 5H16l-.2 2.5-3.8 1.5-3.8-1.5L8 12H6l.5 5 5.5 2 5.5-2L18 6H7z" fill="#1572B6"/>',
  md: '<path d="M3 5v14h18V5H3zm3 10V9h2.5l2 2.5 2-2.5H15v6h-2v-3l-1.5 2h-1L9 12v3H6zm12 0h-2v-2h-1.5L16 15l1.5-2H16V9h2v6z" fill="currentColor"/>',
  jpg: '<rect x="3" y="3" width="18" height="18" rx="2" ry="2" fill="none" stroke="#10B981" stroke-width="2"/><circle cx="8.5" cy="8.5" r="1.5" fill="#10B981"/><polyline points="21 15 16 10 5 21" fill="none" stroke="#10B981" stroke-width="2"/>',
  png: '<rect x="3" y="3" width="18" height="18" rx="2" ry="2" fill="none" stroke="#10B981" stroke-width="2"/><circle cx="8.5" cy="8.5" r="1.5" fill="#10B981"/><polyline points="21 15 16 10 5 21" fill="none" stroke="#10B981" stroke-width="2"/>',
  svg: '<rect x="3" y="3" width="18" height="18" rx="2" ry="2" fill="none" stroke="#10B981" stroke-width="2"/><circle cx="8.5" cy="8.5" r="1.5" fill="#10B981"/><polyline points="21 15 16 10 5 21" fill="none" stroke="#10B981" stroke-width="2"/>',
};

export function getFileIcon(filename: string): string | null {
  const parts = filename.split(".");
  if (parts.length < 2) return null;
  const ext = parts[parts.length - 1].toLowerCase();
  return FILE_ICONS_MAP[ext] || null;
}
