import ws, { WebSocketServer, type Server } from 'ws';
import http from 'http';

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
    
        this.wss.on('connection', (socket) => {
          console.log('WS client connected')
    
          socket.send(
            JSON.stringify({
              type: 'ACTIVE_SESSION',
              payload: LectureClass.activeSession,
            })
          )
    
          socket.on('message', (data) => {
            const msg = JSON.parse(data.toString())
            console.log('WS message:', msg)
          })
    
          socket.on('close', () => {
            console.log('WS client disconnected')
          })
        })
    }

    static get_active_session() {
        return LectureClass.activeSession;
    }

}