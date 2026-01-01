import { Router } from "express";
import { APIResponse } from "../helpers/responses";
import { add_class_schema } from "./zod_schema";
import { verify_teacher_middleware } from "../middlewares/verify_teacher_middleware";
import { classes_modal } from "../db/schema";
import mongoose from "mongoose";

const class_router = Router();

class_router.post('/add-class', verify_teacher_middleware, async (req, res) => {
    const {payload} = req.body;

    const parsed_payload = add_class_schema.safeParse(payload);

    if(parsed_payload.error) {
        res.json(APIResponse.error(`Invalid request schema`))
        return;
    }

    const {class_name, student_ids} = parsed_payload.data;

    const new_class = await classes_modal.create({
        teacherId: req.user_id,
        className: class_name,
        studentIds: student_ids ? student_ids.map(x=> new mongoose.Types.ObjectId(x)) : [],
    })

    res.json(APIResponse.success({
        ...new_class
    }))
    
    return;

})


export default class_router;
