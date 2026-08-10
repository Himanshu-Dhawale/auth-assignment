import { NextResponse } from "next/server";
import { verifyAuth } from "@/app/lib/verifyAuth";

export async function GET(request: Request) {
    const { error, user } = await verifyAuth(request);

    if (error) {
        return error;
    }

    return NextResponse.json(
        {
            id: user.id,
            email: user.email,
            created_at: user.created_at
        },
        { status: 200 }
    );
}