import { NextResponse } from "next/server";
import { handleUpload, type HandleUploadBody } from "@vercel/blob/client";

// Issues short-lived client tokens for direct-to-Blob uploads from the
// admin apps/blog forms (icons, screenshots, cover images) — the file
// bytes never pass through this function's body, only the token request
// does. Admin-only, gated in middleware.ts's API_RULES.
export async function POST(request: Request): Promise<NextResponse> {
  if (!process.env.BLOB_READ_WRITE_TOKEN) {
    return NextResponse.json(
      { error: "Image uploads aren't configured yet (BLOB_READ_WRITE_TOKEN missing)." },
      { status: 503 },
    );
  }

  const body = (await request.json()) as HandleUploadBody;

  try {
    const jsonResponse = await handleUpload({
      body,
      request,
      onBeforeGenerateToken: async () => ({
        allowedContentTypes: ["image/png", "image/jpeg", "image/webp", "image/svg+xml", "image/gif"],
        addRandomSuffix: true,
      }),
    });

    return NextResponse.json(jsonResponse);
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Upload failed." },
      { status: 400 },
    );
  }
}
