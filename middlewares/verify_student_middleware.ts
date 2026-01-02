import type { NextFunction, Request, Response } from "express";
import { ROLE_ENUM } from "../auth/zod_schema";
import { APIResponse } from "../helpers/responses";

export const verify_student_middleware = (req: Request, res: Response, next: NextFunction) => {

    const roles = ROLE_ENUM.enum;
    console.log('role', req.role)
    if(req.role !== roles.student) {
        res.json(APIResponse.error("Forbidden, student access required"))
        return;
    }

    next();
}