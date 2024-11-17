import {logger} from "@/utils/logger";
import {NextResponse} from "next/server";

export function errorHandler(error: any): NextResponse {
    if (error instanceof Error) {
        logger.error(error.message);
        return NextResponse.json(error.message, {status: 500});
    } else {
        logger.error('Unexpected error');
        return NextResponse.json('Unexpected error', {status: 500});
    }
}
