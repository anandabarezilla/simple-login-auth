import mongoose from "mongoose";

const connect = async () => {
  try {
    const db = await mongoose.connect(process.env.MONGO_CONN);
    console.log("Database connected");
    return db;
  } catch (error) {
    console.error("Error connecting to the database", error.message);
  }
};

export default connect;
