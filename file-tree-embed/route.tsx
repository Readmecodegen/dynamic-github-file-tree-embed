import { NextRequest } from "next/server";
import { fetchGitHub } from "@/lib/github-fetch";
import { getToken } from "next-auth/jwt";
import { generateFileTreeSvg } from "./svg-renderer";

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

    if (!repoParam?.includes("/")) {
      return new Response("Missing or invalid repo parameter", { status: 400 });
    }

    const [owner, repoName] = repoParam.split("/");
    const skippedIds = new Set(excludeStr.split(",").filter(Boolean));

    // fetch repo info only when needed
    let resolvedBranch = branch;
    let repoInfo: Record<string, any> | null = null;

    if (!resolvedBranch || showHeader) {
      try {
        repoInfo = await fetchGitHub(
          `https://api.github.com/repos/${owner}/${repoName}`,
          userAccessToken,
          {
            tags: [`tree-${owner}-${repoName}`],
            revalidate: 3600, // 1 hour default cache
          }
        );
        resolvedBranch ??= repoInfo?.default_branch ?? "main";
      } catch {
        resolvedBranch ??= "main";
      }
    }

    // embed avatar as base64 so the svg is self-contained
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
        //svg renders fine without the avatar
      }
    }

    const treeResponse = await fetchGitHub(
      `https://api.github.com/repos/${owner}/${repoName}/git/trees/${resolvedBranch}?recursive=1`,
      userAccessToken,
      {
        tags: [`tree-${owner}-${repoName}`],
        revalidate: 3600, // 1 hour default cache
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
      avatarBase64,
      isTruncated: treeResponse.truncated === true,
    });

    return new Response(svgString, {
      status: 200,
      headers: {
        "Content-Type": "image/svg+xml",
        "Cache-Control": "no-store, max-age=0",
      },
    });
  } catch (error: unknown) {
    console.error("File Tree API Error:", error instanceof Error ? error.message : error);
    return new Response("Error generating SVG", { status: 500 });
  }
}