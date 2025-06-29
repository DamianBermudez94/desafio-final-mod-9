import mongoose from "mongoose";

const MONGODB_URI = process.env.MONGODB_URI || "";

console.log("soy la url de moongose", MONGODB_URI);


if (!MONGODB_URI) {
  throw new Error("No está definida la variable MONGODB_URI");
}

export const connectDB = async () => {
  try {
    if (mongoose.connections[0].readyState) return;
    await mongoose.connect(MONGODB_URI);
    console.log("🔗 MongoDB conectado");
  } catch (err) {
    console.error("❌ Error conectando MongoDB:", err);
  }
};
