import mongoose from "mongoose";

let isConnected = false;

export const connectDB = async () => {
  try {
    mongoose.set("strictQuery", true);
    if (!process.env.MONGODB_URL) return console.log("Missing database url");
    if (!isConnected) {
      await mongoose.connect(process.env.MONGODB_URL, { dbName: "DevFlow" });
      console.log("DB Connected");
      isConnected = true;
    } else {
      console.log("DB already connected.");
    }
  } catch (error) {
    console.log("Error connecting to DB: " + error);
  }
};
