import { connect, set } from "mongoose";

let isConnected = false;

export const connectDB = async () => {
  try {
    set("strictQuery", true);
    if (!process.env.MONGODB_URL) return console.log("Missing database url");
    if (isConnected) return console.log("DB already connected.");

    await connect(process.env.MONGODB_URL, { dbName: "DevFlow" });
    console.log("DB Connected");
    isConnected = true;
  } catch (error) {
    console.log("Error connecting to DB: " + error);
  }
};
