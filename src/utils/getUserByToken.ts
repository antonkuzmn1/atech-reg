import {logger} from "@/utils/logger";
import jwt, {JwtPayload} from "jsonwebtoken";
import {prisma} from "@/utils/prisma";
import {User} from "@prisma/client";
import {StatusData} from "@/utils/interfaces";

const JWT_SECRET: string | undefined = process.env.JWT_SECRET

export async function getUserByToken(token: string): Promise<StatusData> {
    logger.debug('getUserByToken');
    try {

        if (!JWT_SECRET) {
            logger.error('JWT_SECRET is undefined');
            return ({status: 500, data: 'JWT_SECRET is undefined'});
        }

        if (!token) {
            logger.error('"token" field required');
            return ({status: 400, data: '"token" field required'});
        }

        const decodedToken: JwtPayload = jwt.verify(token, JWT_SECRET) as unknown as JwtPayload;
        if (!decodedToken.id) {
            logger.error('Decoded token is undefined');
            return ({status: 403, data: 'Decoded token is undefined'});
        }

        const user: User | null = await prisma.user.findUnique({
            where: {
                id: decodedToken.id,
            },
        });
        if (!user) {
            logger.error('Account not found');
            return ({status: 403, data: 'Account not found'});
        }

        return ({status: 200, data: user});

    } catch (error: unknown) {
        if (error instanceof Error) {
            logger.error(error.message);
            return ({status: 500, data: error.message});
        } else {
            logger.error('Unexpected error');
            return ({status: 500, data: 'Unexpected error'});
        }
    }
}
