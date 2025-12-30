import { APIResponse } from "../classes/responses";

export const request_handler = async(handler: ()=>any ) => {
    try {
        const result = await handler();
        return result;
    } catch(error: any) {
        return;
    }
}