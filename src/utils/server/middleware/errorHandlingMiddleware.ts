import { ErrorRequestHandler, NextFunction } from "express"
import { ApiError } from "../error/ApiError.js"

export const errorHandlingMiddleware: ErrorRequestHandler  = (err: any, req: any, res: any, next: NextFunction) => {
    if (err instanceof ApiError) {
        return res.status(err.status).json({ message: err.message })
    }
    return res.status(500).json({ message: "Непредвиденная" })
} 