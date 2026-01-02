import { Schema } from "mongoose";
import mongoose from "mongoose";

const user = Schema.create({
  name: String,
  email: String,
  password: String, 
  role: String
})

const classes = Schema.create({
    className: String,
    teacherId: mongoose.Types.ObjectId, 
    studentIds: [mongoose.Types.ObjectId], 
    startedAt: String
})

const attendance = Schema.create({
    classId: mongoose.Types.ObjectId,
    studentId: mongoose.Types.ObjectId,
    status: String
})


export const user_modal = mongoose.model('users',user);
export const classes_modal = mongoose.model('classes', classes);
export const attendance_modal = mongoose.model('attendance', attendance);
