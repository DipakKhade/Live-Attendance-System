import ws, { WebSocketServer, type Server } from 'ws';
import { SERVER_PORT } from '../config';


interface activeSessionInterface {
    classId: string,
    startedAt: string,
    attendance: Record<string, 'present'|'absent'>
}

export class LectureClass {
    private static instance: LectureClass;
    ws: Server<typeof ws>| null = null;

    static activeSession: activeSessionInterface = {
        classId: '',
        startedAt: new Date().toISOString(),
        attendance: {}
    };

    constructor() {
        this.set_up_socket_connection()
    }

    static get_instance() {
        if(LectureClass.instance) {
            return LectureClass.instance;
        } else {
            LectureClass.instance = new LectureClass();
            return LectureClass.instance;
        }
    }

    set_up_socket_connection() {
        this.ws = new WebSocketServer({
            port: SERVER_PORT,
        })
        console.log('soc')
    }

    static get_active_session() {
        return LectureClass.activeSession;
    }

}