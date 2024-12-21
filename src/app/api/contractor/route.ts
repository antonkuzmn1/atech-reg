import {NextResponse} from "next/server";
import {logger} from "@/utils/logger";
import {prisma} from "@/utils/prisma";
import {errorHandler} from "@/utils/errorHandler";

export async function GET(req: any): Promise<NextResponse> {
    logger.debug('GET /api/main');
    try {
        const table = await prisma.contractor.findMany();
        return NextResponse.json(table, {status: 200});
    } catch (error: unknown) {
        return errorHandler(error);
    }
}
