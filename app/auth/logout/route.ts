import { NextResponse } from "next/server";
import { verifyAuth } from "@/app/lib/verifyAuth";
import { supabase } from "@/app/lib/supabase";

export async function POST(request: Request) {
    const { error, token } = await verifyAuth(request);

    if (error) {
        return error;
    }

    const { error: signOutError } = await supabase.auth.admin.signOut(token);
    if (signOutError) {
        return NextResponse.json(
            { error: signOutError.message },
            { status: 400 }
        );
    }

    return new NextResponse(null, { status: 204 });
}