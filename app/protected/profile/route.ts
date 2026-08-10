
import { supabase } from "@/app/lib/supabase";
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
    const { data, error } = await supabase.auth.getUser(token);
    if (error) {
        return NextResponse.json(
            {error: "Invalid or expired token"},
            {status: 401}
        );
    }

    return NextResponse.json(
        {
            id: data.user.id,
            email: data.user.email,
            created_at: data.user.created_at
        },
        { status: 200 }
    );
}