import { Request, Response, Router } from 'express';

export class UserController {
    async login(req: Request, res: Response) {
        const { activeAdmin } = req.query;
        
    }
}