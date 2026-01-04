import ws, { WebSocketServer, type Server } from 'ws';
import http from 'http';
import url from 'url';
import { SERVER_CONFIG } from '../config';
import jwt from 'jsonwebtoken';

interface activeSessionInterface {
    classId: string,
    startedAt: string,
    attendance: Record<string, 'present'|'absent'>
}

export class LectureClass {
    private static instance: LectureClass;
    wss: Server<typeof ws>| null = null;

    static activeSession: activeSessionInterface = {
        classId: '',
        startedAt: new Date().toISOString(),
        attendance: {}
    };

    constructor() {

    }

    static get_instance() {
        if(LectureClass.instance) {
            return LectureClass.instance;
        } else {
            LectureClass.instance = new LectureClass();
            return LectureClass.instance;
        }
    }

    attach(server: http.Server) {
        this.wss = new WebSocketServer({ server })

        
        this.wss.on('connection', (socket, req) => {
            console.log('WS client connected')
            
            const params = url.parse(req.url!, true).query;
            const result = this.decode_jwt(params.token as string);

            if(!result.success) {
                socket.send(JSON.stringify({
                    error: 'Auth Failed'
                }))
                socket.close();
            }

            socket.on('message', (data) => {
                const msg = JSON.parse(data.toString()) as unknown as {event: string, data: {student_id: string, status: 'present' | 'absent'}};
                switch(msg.event) {
                    case 'ATTENDANCE_MARKED' : {
                        if(result.role !== 'teacher') {
                            socket.send(JSON.stringify({
                                "event": "ERROR",
                                "data": {
                                    "message": "Forbidden, teacher event only"
                                }
                            }))
                            return;
                        } else {
                            this.mark_attendance(msg.data)
                        }
                        break;
                    };
                    case 'TODAY_SUMMARY' :  break;
                    case 'MY_ATTENDANCE' :  break;
                    case 'DONE' :  break;
                    default: 
                        console.log('Event not found', msg.event);
                }
            })
        
            socket.on('close', () => {
                console.log('WS client disconnected')
            })
            })
    }

    static get_active_session() {
        return LectureClass.activeSession;
    }

    decode_jwt(token: string) {
        let success = false;
        let user_id= null;
        let role = null;
        jwt.verify(token, SERVER_CONFIG.JWT_SEC, (err: any, decode: any)=> {
            if(decode) {
                success = true
                user_id = decode.userId;
                role = decode.role;
            } else {
                    success = false
            } 
        })
        return {
            success, user_id, role
        };
    }

    mark_attendance(data: {student_id: string, status: 'present' | 'absent'}) {
        LectureClass.activeSession.attendance[data.student_id] = data.status;
        return;
    }

    get_todays_summary() {

    }

}