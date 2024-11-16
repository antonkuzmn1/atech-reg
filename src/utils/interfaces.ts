export type StatusCodes = 500 | 400 | 403 | 401 | 200

export interface StatusData {
    status: StatusCodes;
    data: any;
}
