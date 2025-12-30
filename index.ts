import express, { type NextFunction, type Request, type Response } from 'express'
import { SERVER_PORT } from './config';
import auth_router from './auth/auth_router';
import { APIResponse } from './classes/responses';

const app = express();

app.use('/api/v1/auth', auth_router);


app.use((err: any, req: Request, res: Response, next: NextFunction) => {
    res.json(APIResponse.error(`error occureed in ${req.path} route`))
    return 
});

app.listen(SERVER_PORT, ()=> console.log(`Server is up on Port ${SERVER_PORT}`))
