import { NextRequest } from "next/server";
import { fetchGitHub } from "@/lib/github-fetch";
import { getToken } from "next-auth/jwt";
import { generateFileTreeSvg } from "./svg-renderer";
import crypto from "crypto";

// nodejs runtime required for next-auth getToken()
export const runtime = "nodejs";

export async function GET(req: NextRequest) {
  try {
    // prefer user's oauth token (5k req/hr) over env fallback (60 req/hr unauthenticated)
    const session         = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });
    const userAccessToken = (session?.accessToken as string | undefined) ?? undefined;

    const { searchParams } = new URL(req.url);
    const repoParam     = searchParams.get("repo");
    const branch        = searchParams.get("branch");
    const maxDepth      = parseInt(searchParams.get("maxDepth") || "0", 10);
    const foldersOnly   = searchParams.get("foldersOnly") === "true";
    const includeHidden = searchParams.get("includeHidden") === "true";
    const excludeStr    = searchParams.get("exclude") || "";
    const theme         = searchParams.get("theme") || "dark";
    const style         = searchParams.get("style") || "ascii";
    const fontSizeParam = parseInt(searchParams.get("fontSize") || "16", 10);
    const transparentBg = searchParams.get("transparentBg") === "true";
    const showHeader    = searchParams.get("showHeader") === "true";
    const showBorder    = searchParams.get("showBorder") === "true";
    const showFileIcons = searchParams.get("showFileIcons") === "true";

    if (!repoParam?.includes("/")) {
      return new Response("Missing or invalid repo parameter", { status: 400 });
    }

    const [ownerRaw, repoNameRaw] = repoParam.split("/");
    const owner = ownerRaw.toLowerCase();
    const repoName = repoNameRaw.toLowerCase();
    const skippedIds = new Set(excludeStr.split(",").filter(Boolean));

    let resolvedBranch = branch;
    let repoInfo: Record<string, any> | null = null;

    if (!resolvedBranch || showHeader) {
      try {
        repoInfo = await fetchGitHub(
          `https://api.github.com/repos/${owner}/${repoName}`,
          userAccessToken,
          {
            tags: [`tree-${owner}-${repoName}`],
            revalidate: 7200, // 2 hours default cache
          }
        );
        resolvedBranch ??= repoInfo?.default_branch ?? "main";
      } catch {
        resolvedBranch ??= "main";
      }
    }

    let avatarBase64 = "";
    if (showHeader && repoInfo?.owner?.avatar_url) {
      try {
        const imgRes = await fetch(repoInfo.owner.avatar_url);
        if (imgRes.ok) {
          const buf    = Buffer.from(await imgRes.arrayBuffer());
          const mime   = imgRes.headers.get("content-type") ?? "image/png";
          avatarBase64 = `data:${mime};base64,${buf.toString("base64")}`;
        }
      } catch {
      }
    }

    const treeResponse = await fetchGitHub(
      `https://api.github.com/repos/${owner}/${repoName}/git/trees/${resolvedBranch}?recursive=1`,
      userAccessToken,
      {
        tags: [`tree-${owner}-${repoName}`],
        revalidate: 7200, // 2 hours default cache
      }
    );

    if (!treeResponse?.tree) {
      return new Response("Failed to fetch repository tree", { status: 404 });
    }

    const svgString = generateFileTreeSvg(treeResponse.tree, {
      repoName,
      owner,
      maxDepth,
      foldersOnly,
      includeHidden,
      skippedIds,
      theme,
      style,
      fontSizeParam,
      transparentBg,
      showHeader,
      showBorder,
      showFileIcons,
      avatarBase64,
      isTruncated: treeResponse.truncated === true,
    });

    // Double-layer ETag caching
    const hash = crypto.createHash("md5").update(svgString).digest("hex");
    const etag = `"${hash}"`;

    const ifNoneMatch = req.headers.get("if-none-match");
    if (ifNoneMatch === etag) {
      return new Response(null, {
        status: 304,
        headers: {
          "ETag": etag,
          "Cache-Control": "public, max-age=60, s-maxage=60, stale-while-revalidate=300",
          "Content-Type": "image/svg+xml",
        },
      });
    }

    return new Response(svgString, {
      status: 200,
      headers: {
        "Content-Type": "image/svg+xml",
        "Cache-Control": "public, max-age=60, s-maxage=60, stale-while-revalidate=300",
        "ETag": etag,
      },
    });
  } catch (error: unknown) {
    console.error("File Tree API Error:", error instanceof Error ? error.message : error);
    const errorMsg = error instanceof Error ? error.message : "Unknown error";
   
    const errorSvg = `<svg width="400" height="100" xmlns="http://www.w3.org/2000/svg">
      <rect width="100%" height="100%" fill="#1e1e1e" rx="4" ry="4"/>
      <text x="20" y="40" fill="#f87171" font-family="monospace" font-size="14">Error generating File Tree:</text>
      <text x="20" y="65" fill="#fca5a5" font-family="monospace" font-size="12">${errorMsg.replace(/</g, "&lt;").replace(/>/g, "&gt;")}</text>
    </svg>`;

    return new Response(errorSvg, { 
      status: 200, 
      headers: {
        "Content-Type": "image/svg+xml",
        "Cache-Control": "no-cache, no-store",
      }
    });
  }
}
