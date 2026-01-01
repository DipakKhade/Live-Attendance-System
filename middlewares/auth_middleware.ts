import type { NextFunction, Request, Response } from "express";
import { APIResponse } from "../classes/responses";
import jwt from 'jsonwebtoken';
import { JWT_SEC } from "../config";

export const auth_moddleware = (req: Request, res: Response, next: NextFunction) => {
    const token = req.headers.token as string;

    if(!token) {
        res.json(APIResponse.error(`token not found`));
        return;
    }

    const is_valid_token = jwt.verify(token, JWT_SEC) as {userId: string, role: string}

    if(!is_valid_token) {
        res.json(APIResponse.error(`invalid token!`));
        return;
    }

    req.user_id = is_valid_token.userId

    next();
}