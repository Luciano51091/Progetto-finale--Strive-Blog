import dotenv from "dotenv";
import mongoose from "mongoose";

dotenv.config();
export async function connect() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log("connesso correttamente DB");
  } catch (error) {
    console.error("errore nella connessione DB:", error);
  }
}
