
import { NextResponse } from "next/server";

export async function GET(request: Request) {
    const authHeader = request.headers.get("authorization");

    if (!authHeader?.startsWith("Bearer ")) {
        return NextResponse.json(
          { error: "Access token required" },
          {status: 401}
        );
    }

    const token = authHeader.slice(7);

    if (token === "") {
        return NextResponse.json(
            {error: "Access token required"},
            {status: 401}
        );
    }

    return NextResponse.json({ message: "token received, verification comes in stage 3" });
}