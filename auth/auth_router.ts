import { Router } from "express";
import { login_schema, signin_schema } from "./types";
import { APIResponse } from "../classes/responses";
import { user_modal } from "../db/schema";
import bcrypt from 'bcrypt';
import { JWT_SEC, PASSWORD_HASH_SALT_ROUNDS } from "../config";
import jwt from 'jsonwebtoken';

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
        res.json(APIResponse.error(`User aleady exists`))
        return 
    }

    const hased_password = await bcrypt.hash(password, PASSWORD_HASH_SALT_ROUNDS);

    const new_user = await user_modal.create({
      name,
      email, 
      password: hased_password,
      role 
    })

    res.json(APIResponse.success({
        user_id: new_user._id
    }))

} )

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
        res.json(APIResponse.error(`Invalid credentionals`))
        return
    }

    let token = '';
    token = jwt.sign({
        userId: user._id,
        role: user.role
    }, JWT_SEC)

    res.json(APIResponse.success({
        token
    }))

    return;

})

auth_router.post('/me', async(req, res)=> {})


export default auth_router;