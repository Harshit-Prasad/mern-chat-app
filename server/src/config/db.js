import mongoose from "mongoose";

const connectDB = async () => {
  try {
    const connect = await mongoose.connect(process.env.MONGO_URI, {
      // const connect = await mongoose.connect("mongodb://localhost:27017", {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    console.log(`MongoDB Connected: ${connect.connection.host}`);
  } catch (error) {
    console.error(`Error: ${error.message}`);
    // Exit with a non-zero status code to indicate an error
    process.exit(1);
  }
};

export { connectDB };
