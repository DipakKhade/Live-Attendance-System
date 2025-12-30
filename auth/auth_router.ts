import { Router } from "express";
import { request_handler } from "./request_handler";


const auth_router = Router();

auth_router.post('/signup', async(req, res) => {
    
} )

auth_router.post('/login', async(req, res)=> {})

auth_router.post('/me', async(req, res)=> {})


export default auth_router;