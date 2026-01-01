import mongoose from "mongoose";
import { SERVER_CONFIG } from "../config";

export async function connect_to_db() {
    await mongoose.connect(SERVER_CONFIG.DB_URL).then(()=> console.log(`Connecteed to db...`))
}