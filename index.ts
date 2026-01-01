import express, { type NextFunction, type Request, type Response } from 'express'
import { SERVER_CONFIG } from './config';
import auth_router from './auth/auth_router';
import { APIResponse } from './helpers/responses';
import { connect_to_db } from './db';
import class_router from './class/class_router';
import { auth_moddleware } from './middlewares/auth_middleware';
import http from 'http';
import { LectureClass } from './class/lecture';

const app = express();

connect_to_db()

app.use(express.json());

app.use('/api/v1/auth', auth_router);

app.use('/api/v1/class', auth_moddleware, class_router);


app.use((err: any, req: Request, res: Response, next: NextFunction) => {
    res.json(APIResponse.error(`error occureed in ${req.path} route, error: ${err.message}`))
    return 
});


const server = http.createServer(app);

LectureClass.get_instance().attach(server);

server.listen(SERVER_CONFIG.SERVER_PORT, ()=> console.log(`HTTP And Web Socket Server are up on Port ${SERVER_CONFIG.SERVER_PORT}`))
