import express, { type NextFunction, type Request, type Response } from 'express'
import { SERVER_PORT } from './config';
import auth_router from './auth/auth_router';
import { APIResponse } from './class/responses';
import { connect_to_db } from './db';

const app = express();

connect_to_db()

app.use(express.json());

app.use('/api/v1/auth', auth_router);

// app.use('/api/v1/class', class_router);


app.use((err: any, req: Request, res: Response, next: NextFunction) => {
    res.json(APIResponse.error(`error occureed in ${req.path} route, error: ${err.message}`))
    return 
});

app.listen(SERVER_PORT, ()=> console.log(`Server is up on Port ${SERVER_PORT}`))
