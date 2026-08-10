import { NextResponse } from "next/server";
import { supabase } from "@/app/lib/supabase";

export async function verifyAuth(request: Request) {
    const authHeader = request.headers.get("authorization");

    if (!authHeader?.startsWith("Bearer ")) {
        return {
            error: NextResponse.json({ error: "Access token required" }, { status: 401 }),
            user: null
        };
    }

    const token = authHeader.slice(7);
    if (token === "") {
        return {
            error: NextResponse.json({ error: "Access token required" }, { status: 401 }),
            user: null
        };
    }

    const { data, error } = await supabase.auth.getUser(token);
    if (error) {
        return {
            error: NextResponse.json({ error: "Invalid or expired token" }, { status: 401 }),
            user: null
        };
    }

    return { error: null, user: data.user, token };
}