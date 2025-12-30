
export class APIResponse {
    data: any = {};
    error_msg: string = ''; 

    constructor() {

    }

    static success(data: any): object {
        return {
            success: true,
            data
        }
    }

    static error(error_message: string): object {
        return {
            success: false,
            error: error_message
        }
    }
}