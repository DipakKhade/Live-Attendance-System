import { Router } from "express";
import { APIResponse } from "../helpers/responses";
import { add_class_schema, add_class_student } from "./zod_schema";
import { verify_teacher_middleware } from "../middlewares/verify_teacher_middleware";
import { classes_modal } from "../db/schema";
import mongoose, { type ObjectId } from "mongoose";

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
        class_id: new_class._id
    }))

    return;

})

class_router.post('/:id/add-student', verify_teacher_middleware, async(req, res) => {
    const {payload} = req.body;
    const class_id = req.params.id;

    const parsed_payload = add_class_student.safeParse(payload);

    if(parsed_payload.error) {
        res.json(APIResponse.error(`Invalid request schema`))
        return;
    }

    const {student_id} = parsed_payload.data;    

    const class_doc = await classes_modal.findOne({
        _id: class_id
    })

    let student_ids_array = class_doc?.studentIds as unknown as  mongoose.Types.ObjectId[];
    let new_student_id = new mongoose.Types.ObjectId(student_id);

    if(student_ids_array?.includes(new_student_id)) {
        res.json(APIResponse.error(`Student already present in class ${class_doc?.className}`))
        return;
    }

    student_ids_array!.push()

    res.json(APIResponse.success({
        _id: class_doc?._id,
        class_name: class_doc?.className,
        teacher_id: class_doc?.teacherId,
        student_ids: class_doc?.studentIds
    }))

    return;
})

class_router.get('/:id', async (req, res) => {
    const class_id = req.params.id;

    const class_doc = await classes_modal.findOne({
        _id: new mongoose.Types.ObjectId(class_id)
    })

    const allowd_ids = [...class_doc!.studentIds, class_doc?.teacherId]

    if(!allowd_ids.includes(new mongoose.Types.ObjectId(req.user_id))) {
        res.json(APIResponse.error(`Forbidden, access required`))
        return;
    }

    

    res.json(APIResponse.success({}))
    return;
})


export default class_router;
