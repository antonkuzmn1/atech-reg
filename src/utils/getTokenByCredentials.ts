import {logger} from "@/utils/logger";
import {prisma} from "@/utils/prisma";
import {User} from "@prisma/client";
import jwt from "jsonwebtoken";
import {StatusData} from "@/utils/interfaces";

const JWT_SECRET: string | undefined = process.env.JWT_SECRET

// GET /api/auth
export async function getTokenByCredentials(username: string, password: string): Promise<StatusData> {
    logger.debug('getTokenByCredentials');
    try {

        if (!JWT_SECRET) {
            logger.error('JWT_SECRET is undefined');
            return ({status: 500, data: 'JWT_SECRET is undefined'});
        }

        if (!username) {
            logger.error('"username" field required');
            return ({status: 400, data: '"username" field required'});
        }
        if (!password) {
            logger.error('"password" field required');
            return ({status: 400, data: '"password" field required'});
        }

        const user: User | null = await prisma.user.findUnique({
            where: {
                username: username,
            },
        });
        if (!user) {
            logger.error('Account not found');
            return ({status: 403, data: 'Account not found'});
        }

        const passwordIsValid = password === user.password;
        if (!passwordIsValid) {
            logger.error('Passwords do not match');
            return ({status: 403, data: 'Passwords do not match'});
        }

        const token = jwt.sign({id: user.id}, JWT_SECRET, {expiresIn: process.env.TOKEN_LIFETIME});

        return ({status: 200, data: token});

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
