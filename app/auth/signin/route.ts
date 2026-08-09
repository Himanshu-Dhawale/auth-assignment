import {NextResponse} from "next/server";
import {supabase} from "../../lib/supabase";


export async function POST(request: Request){
    let body : {email?: string; password?: string};

    try{
        body = await request.json();
    }catch{
       return NextResponse.json(
        {error: "Invalid JSON body"},
        {status: 400}
       )
    }

    const {email, password} = body;
    if(!email || !password){
        return NextResponse.json(
            {error: "Email and Password are required"},
            {status: 400}
        )
    }


    const {data, error} = await supabase.auth.signInWithPassword({email, password});
     
    if(error){
        return NextResponse.json(
            {error: "Invalid login credentials"},
            {status: 401}
        )
    }

    return NextResponse.json({
        access_token: data.session.access_token,
        refresh_token: data.session.refresh_token
    }, {
        status: 200
    })
}