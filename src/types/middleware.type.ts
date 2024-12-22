import { NextFunction, Request, Response } from "express"

export type ErrorRequestHandler = (
    err: any,
    req: Request,
    res: Response,
    next: NextFunction
) => void;