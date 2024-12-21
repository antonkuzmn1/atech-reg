import {NextResponse} from "next/server";
import {logger} from "@/utils/logger";
import {errorHandler} from "@/utils/errorHandler";
import {prisma} from "@/utils/prisma";
import {getUserByToken} from "@/utils/getUserByToken";

// GET /api/main
export async function GET(req: any): Promise<NextResponse> {
    logger.debug('GET /api/main');
    try {
        const url = req.nextUrl;
        const year = url.searchParams.get('year');
        const month = url.searchParams.get('month');

        if (!year || !month) {
            return NextResponse.json({error: 'Year and month are required'}, {status: 400});
        }

        const parsedYear = parseInt(year, 10);
        const parsedMonth = parseInt(month, 10);

        if (isNaN(parsedYear) || isNaN(parsedMonth) || parsedMonth < 1 || parsedMonth > 12) {
            return NextResponse.json({error: 'Invalid year or month'}, {status: 400});
        }

        let where = {}

        where = {
            ...where,
            dateInput: {
                gte: new Date(parsedYear, parsedMonth - 1, 1),
                lt: new Date(parsedYear, parsedMonth, 1),
            },
        }

        const contractors = url.searchParams.get('contractors');
        if (contractors) {
            where = {
                ...where,
                contractorId: {
                    in: contractors.split(',').map(Number),
                },
            }
        }

        const table = await prisma.tableMain.findMany({
            where,
            include: {
                contractor: true,
                initiator: true,
            }
        });
        return NextResponse.json(table, {status: 200});
    } catch (error: unknown) {
        return errorHandler(error);
    }
}

// POST /api/main
export async function POST(req: any): Promise<NextResponse> {
    logger.debug('POST /api/main');
    try {
        const body: any = await req.json();
        if (!body.table) {
            logger.error('Table required');
            return NextResponse.json('Table required', {status: 401});
        }

        if (body.table.length === 0) {
            logger.error('Table is empty');
            return NextResponse.json('Table is empty', {status: 401});
        }

        let i = 0;
        for (const row of body.table) {
            const inputDate = row.inputDate as string;
            const contrAgentName = row.contrAgent as string;
            const paymentDestination = row.paymentDestination as string;
            const initiatorOfPaymentName = row.initiatorOfPayment as string;
            const sum = row.sum as number;
            const oldRows = await prisma.tableMain.findMany({
                where: {
                    dateInput: inputDate,
                    contractor: {name: contrAgentName},
                    textDestination: paymentDestination,
                    initiator: {name: initiatorOfPaymentName},
                    sum: sum,
                }
            });
            if (oldRows.length === 0) {
                let contractor = await prisma.contractor.findUnique({where: {name: contrAgentName}});
                if (!contractor) {
                    contractor = await prisma.contractor.create({data: {name: contrAgentName}})
                    logger.info(`New contractor: ${contractor.name}`);
                }
                let initiator = await prisma.initiator.findUnique({where: {name: initiatorOfPaymentName}});
                if (!initiator) {
                    initiator = await prisma.initiator.create({data: {name: initiatorOfPaymentName}})
                    logger.info(`New initiator: ${initiator.name}`);
                }
                const newRow = await prisma.tableMain.create({
                    data: {
                        dateInput: inputDate,
                        contractorId: contractor.id,
                        textDestination: paymentDestination,
                        initiatorId: initiator.id,
                        sum: sum,
                        sumClosing: 0,
                    }
                });
                logger.info(`New row: ${newRow.textDestination}`);
                i++;
            }
        }
        return NextResponse.json({total: i}, {status: 200});
    } catch (error: unknown) {
        return errorHandler(error);
    }
}

export async function PUT(req: any): Promise<NextResponse> {
    logger.debug('PUT /api/main');
    try {
        const body: any = await req.json();
        if (!body.rows) {
            logger.error('Rows required');
            return NextResponse.json('Rows required', {status: 401});
        }

        if (body.rows.length === 0) {
            logger.error('Rows is empty');
            return NextResponse.json('Rows is empty', {status: 401});
        }

        const allow = await checkAuth(req);

        let i = 0;
        for (const row of body.rows) {
            const id = row.id;
            const sumClosing = row.sumClosing;
            const ddAbout = row.ddAbout;
            const ddMark = row.ddMark;
            const ddStatus = row.ddStatus;
            const dateCopy = row.dateCopy;
            const dateOrig = row.dateOrig;
            const description = row.description;

            const where = {
                id,
            }

            const data = allow ? {
                sumClosing,
                ddAbout,
                ddMark,
                ddStatus,
                dateCopy: dateCopy ? new Date(dateCopy) : null,
                dateOrig: dateOrig ? new Date(dateOrig) : null,
                description,
            } : {
                sumClosing,
                ddAbout,
                ddStatus,
                dateCopy: dateCopy ? new Date(dateCopy) : null,
                dateOrig: dateOrig ? new Date(dateOrig) : null,
                description,
            }

            const updatedRow = await prisma.tableMain.update({where, data});
            logger.info(`Updated row: ${updatedRow.textDestination}`)
            i++;
        }
        return NextResponse.json({total: i}, {status: 200});
    } catch (error: unknown) {
        return errorHandler(error);
    }
}

async function checkAuth(req: any): Promise<boolean> {
    return new Promise(async (resolve, _reject) => {
        const tokenRaw = req.headers.get('authorization');
        if (!tokenRaw) {
            resolve(false);
            return;
        }
        const token: string | null = tokenRaw && tokenRaw.startsWith('Bearer ') ? tokenRaw.substring(7) : null;
        if (!token) {
            resolve(false);
            return;
        }
        const {status, data} = await getUserByToken(token);
        if (status === 200) {
            resolve(true);
            return;
        } else {
            resolve(false);
            return;
        }
    });
}
