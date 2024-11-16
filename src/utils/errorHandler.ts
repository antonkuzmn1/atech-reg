import {logger} from "@/utils/logger";
import {NextResponse} from "next/server";
import {StatusData} from "@/utils/interfaces";

export function errorHandler(error: any): NextResponse<StatusData> {
    if (error instanceof Error) {
        logger.error(error.message);
        return NextResponse.json({status: 500, data: error.message});
    } else {
        logger.error('Unexpected error');
        return NextResponse.json({status: 500, data: 'Unexpected error'});
    }
}
