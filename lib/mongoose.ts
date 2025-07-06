import mongoose from "mongoose";

const MONGODB_URI = process.env.MONGODB_URI || "";


if (!MONGODB_URI) {
  throw new Error("No está definida la variable MONGODB_URI");
}

export const connectDB = async () => {
  try {
    if (mongoose.connections[0].readyState) {
      console.log("🔁 Ya estaba conectado a MongoDB");
      return;
    }
    await mongoose.connect(MONGODB_URI);
    console.log("🔗 MongoDB conectado");
  } catch (err: any) {
    console.error("❌ Error conectando MongoDB:", err.message || err);
  }
};
