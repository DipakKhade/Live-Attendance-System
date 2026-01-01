import { Router } from "express";
import { login_schema, signin_schema } from "./zod_schema";
import { APIResponse } from "../helpers/responses";
import { user_modal } from "../db/schema";
import bcrypt from 'bcrypt';
import { SERVER_CONFIG } from "../config";
import jwt from 'jsonwebtoken';
import { auth_moddleware } from "../middlewares/auth_middleware";

const auth_router = Router();

auth_router.post('/signup', async(req, res) => {
    const {payload}  = req.body;

    const parsedPayload = signin_schema.safeParse(payload)

    if (parsedPayload.error) {
        return res.json(APIResponse.error("Invalid request schema"))
    }

    const {email, name, password, role} = parsedPayload.data;

    const user = await user_modal.findOne({
        email
    })

    if(user) {
        res.json(APIResponse.error(`Email already exists`))
        return 
    }

    const hased_password = await bcrypt.hash(password, SERVER_CONFIG.PASSWORD_HASH_SALT_ROUNDS);

    const new_user = await user_modal.create({
      name,
      email, 
      password: hased_password,
      role 
    })

    res.json(APIResponse.success({
        user_id: new_user._id
    }))

})

auth_router.post('/login', async(req, res)=> {
    const {payload} = req.body;
    
    const parsedPayload = login_schema.safeParse(payload)

    if (parsedPayload.error) {
        return res.json(APIResponse.error("Invalid request schema"))
    }

    const {email, password} = parsedPayload.data;

    const user = await user_modal.findOne({
        email
    })

    if(!user) {
        res.json(APIResponse.error(`User not found with email ${email}`))
        return
    }

    const db_password = user.password as string;

    const match_password = await bcrypt.compare(password, db_password)

    if(!match_password) {
        res.json(APIResponse.error(`Invalid email or password`))
        return
    }

    let token = '';
    token = jwt.sign({
        userId: user._id,
        role: user.role
    }, SERVER_CONFIG.JWT_SEC)

    res.json(APIResponse.success({
        token
    }))

    return;

})

auth_router.get('/me', auth_moddleware, async(req, res)=> {
    const { user_id } = req;

    const user = await user_modal.findOne({
        _id: user_id
    })

    res.json(APIResponse.success({
        _id: user?._id,
        name: user?.name,
        email: user?.email,
        role: user?.role
    }))

    return;
})


export default auth_router;