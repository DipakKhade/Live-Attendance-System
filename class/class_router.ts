import { Router } from "express";
import { APIResponse } from "../helpers/responses";
import { add_class_schema, add_class_student_schema, start_class_schema } from "./zod_schema";
import { verify_teacher_middleware } from "../middlewares/verify_teacher_middleware";
import { classes_modal, user_modal } from "../db/schema";
import mongoose from "mongoose";
import { verify_student_middleware } from "../middlewares/verify_student_middleware";
import { LectureClass } from "./lecture";

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

    const parsed_payload = add_class_student_schema.safeParse(payload);

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

class_router.get('/get_class/:id', async (req, res) => {
    const class_id = req.params.id;

    const class_doc = await classes_modal.findOne({
        _id: new mongoose.Types.ObjectId(class_id)
    })

    const allowd_ids = [...(class_doc!.studentIds).map(x=> x.toString()), class_doc?.teacherId?.toString()]

    console.log(allowd_ids)

    console.log(req.user_id)

    if(!allowd_ids.includes(req.user_id)) {
        res.json(APIResponse.error(`Forbidden, access required`))
        return;
    }

    let result = [];

    for(let x of class_doc!.studentIds) {
        const student = await user_modal.findOne({
            _id: x
        })

        result.push({
            _id: student?._id,
            name: student?.name,
            email: student?.email
        })
    }

    res.json(APIResponse.success({
        _id: class_doc?._id,
        class_name: class_doc?.className,
        teacher_id: class_doc?.teacherId,
        students: [...result]
    }))
    return;
})

class_router.get('/students', verify_teacher_middleware, async (req, res) => {
    const data = await user_modal.find({
        role: 'student'
    })

    res.json(APIResponse.success([...data.map(x => {
        return {
            _id: x._id,
            name: x.name,
            email: x.email
        }
    })]))

    return;
})


class_router.get('/:id/my-attendance', verify_student_middleware, async(req, res) => {

    const attendance = LectureClass.get_active_session().attendance;

    const user_id = req.user_id;

    res.json(APIResponse.success({
        class_id: req.params.id,
        status: attendance.hasOwnProperty(user_id!) ? "present" : null
    }))
})

class_router.post('/attendance/start', verify_teacher_middleware, async(req, res) => {
    const {payload} = req.body;    

    const parsed_payload = start_class_schema.safeParse(payload);

    if(parsed_payload.error) {
        res.json(APIResponse.error(`Invalid request schema`))
        return;
    }

    const {class_id} = parsed_payload.data;

    const start_at = new Date();

    const update_class = await classes_modal.updateOne({
        _id: new mongoose.Types.ObjectId(class_id)
        
    }, {
        $set: {
            startedAt: start_at
        }
    })

    res.json(APIResponse.success({
        class_id,
        start_at
    }))
})

export default class_router;
