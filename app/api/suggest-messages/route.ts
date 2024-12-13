import { NextRequest, NextResponse } from "next/server";
import { google } from "@ai-sdk/google";
import { streamText } from "ai";

export const runtime = "edge";

export async function POST(req: NextRequest) {
  try {
    const { prompt } = await req.json();
    const seed = Math.floor(Math.random() * 1000);

    const result = streamText({
      model: google("gemini-pro"),
      prompt,
      temperature: 0.75,
      maxTokens: 150,
      seed,
    });

    if (!result) {
      return NextResponse.json("Error generating response", {
        status: 500,
      });
    }

    return result.toDataStreamResponse({
      headers: {
        "Content-Type": "text/event-stream",
        "Cache-Control": "no-cache, no-transform",
        Connection: "keep-alive",
      },
    });
  } catch (error: any) {
    console.error(error.message);
    return NextResponse.json("Error generating response: " + error.message, {
      status: 500,
    });
  }
}
