import {NextResponse} from "next/server";

// GET /api
export async function GET() {
    return NextResponse.json({status: 200});
}
