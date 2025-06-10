import mongoose from "mongoose";

// Cache que evita múltiplas conexões em ambientes de desenvolvimento (HOT RELOAD)

const MONGO_URL = process.env.MONGODB_URL as string;

if (!MONGO_URL) {
  throw new Error("MONGO_URL não está definida no .env.local");
}

let cached = global.mongoose;

if (!cached) {
  cached = global.mongoose = { conn: null, promise: null };
}

export async function connectToDatabase() {
  if (cached.conn) return cached.conn;

  if (!cached.promise) {
    cached.promise = mongoose.connect(MONGO_URL, {
      bufferCommands: false,
    }).then((mongoose) => {
      return mongoose;
    });
  }

  cached.conn = await cached.promise;
  return cached.conn;
}