
export class Response {
    data: any = {};
    error_msg: string = ''; 

    constructor() {
        
    }

    static success(data: any) {
        return {
            success: true,
            data
        }
    }

    static error(error_message: any) {
        return {
            success: false,
            error: error_message
        }
    }
}