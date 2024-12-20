import {NextResponse} from "next/server";
import {logger} from "@/utils/logger";
import {getTokenByCredentials} from "@/utils/getTokenByCredentials";
import {errorHandler} from "@/utils/errorHandler";
import {getUserByToken} from "@/utils/getUserByToken";

// GET /api/auth
export async function GET(req: any): Promise<NextResponse> {
    logger.debug('GET /api/auth');
    try {
        const tokenRaw = req.headers.get('authorization');
        if (!tokenRaw) {
            return NextResponse.json('Authorization header is missing', {status: 401});
        }
        const token: string | null = tokenRaw && tokenRaw.startsWith('Bearer ') ? tokenRaw.substring(7) : null;
        if (!token) {
            logger.error('Token should starts with "Beaver"');
            return NextResponse.json('Token should starts with "Bearer"', {status: 403});
        }
        const {status, data} = await getUserByToken(token);
        return NextResponse.json(data, {status});
    } catch (error: unknown) {
        return errorHandler(error);
    }
}

// POST /api/auth
export async function POST(req: any): Promise<NextResponse> {
    logger.debug('POST /api/auth');
    try {
        const body: any = await req.json();
        const {username, password} = body;
        const {status, data} = await getTokenByCredentials(username, password);
        return NextResponse.json(data, {status});
    } catch (error: unknown) {
        return errorHandler(error);
    }
}
