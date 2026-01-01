import type { NextFunction, Request, Response } from "express";
import { ROLE_ENUM } from "../auth/zod_schema";
import { APIResponse } from "../helpers/responses";

export const verify_teacher_middleware = (req: Request, res: Response, next: NextFunction) => {

    const roles = ROLE_ENUM.enum;

    if(req.role !== roles.teacher) {
        res.json(APIResponse.error("Forbidden, teacher access required"))
    }

    next();
}