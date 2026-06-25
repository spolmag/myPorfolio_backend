import mongoose from "mongoose";

export const connectDB = async () => {
  try {
    const uri = process.env.MONGODB_URI;

    if (!uri) {
      throw new Error("MONGODB_URI is undifined!");
    }

    const connectionOptions = {
      dbName: "portfolio_contact",
      socketTimeoutMS: 45000,
    };

    await mongoose.connect(uri, connectionOptions);
    console.log(`MongoDB connected 🟢`);
  } catch (error) {
    console.error(`MongoDB connection failed! 🔴`, error.message);
    process.exit(1);
  }
};
