import { NextRequest, NextResponse } from "next/server";

/**
 * Proxy route for images to avoid CORS issues
 * Fetches images from external sources (like S3) and serves them with proper CORS headers
 */
export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const imageUrl = searchParams.get("url");

  if (!imageUrl) {
    return NextResponse.json(
      { error: "Missing image URL parameter" },
      { status: 400 }
    );
  }

  try {
    // Validate that the URL is from an allowed domain
    const allowedDomains = [
      "cpip-dev-public.s3.eu-west-1.amazonaws.com",
      "numoniimages.s3.amazonaws.com",
      "numoni-prod-uploads.s3.eu-west-1.amazonaws.com",
      "s3.amazonaws.com",
    ];

    const url = new URL(imageUrl);
    const isAllowed = allowedDomains.some((domain) =>
      url.hostname.includes(domain)
    );

    if (!isAllowed) {
      return NextResponse.json(
        { error: "Domain not allowed" },
        { status: 403 }
      );
    }

    // Fetch the image from the external source
    const imageResponse = await fetch(imageUrl, {
      headers: {
        "User-Agent": "Mozilla/5.0",
      },
    });

    if (!imageResponse.ok) {
      return NextResponse.json(
        { error: `Failed to fetch image: ${imageResponse.statusText}` },
        { status: imageResponse.status }
      );
    }

    // Get the image data
    const imageBuffer = await imageResponse.arrayBuffer();
    const contentType =
      imageResponse.headers.get("content-type") || "image/png";

    // Return the image with proper headers
    return new NextResponse(imageBuffer, {
      status: 200,
      headers: {
        "Content-Type": contentType,
        "Cache-Control": "public, max-age=31536000, immutable",
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "GET",
      },
    });
  } catch (error) {
    console.error("Error proxying image:", error);
    return NextResponse.json(
      {
        error: "Failed to proxy image",
        message: error instanceof Error ? error.message : String(error),
      },
      { status: 500 }
    );
  }
}

