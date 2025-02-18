import { ApiError } from "../error/ApiError.js"
import { ErrorRequestHandler } from "../../../types/middleware.type.js"

export const errorHandlingMiddleware: ErrorRequestHandler = (err, req, res, next) => {
    if (err instanceof ApiError) {
        return res.status(err.status).json({ message: err.message })
    }
    return res.status(500).json({ message: "Непредвиденная ошибка!" })
} 