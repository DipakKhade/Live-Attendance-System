import mongoose from "mongoose";
import { DB_URL } from "../config";

export async function connect_to_db() {
    await mongoose.connect(DB_URL).then(()=> console.log(`Connecteed to db...`))
}