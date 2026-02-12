import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config();
const dbUrl =  process.env.DATABASE_URL_DEV;

mongoose.set("strictQuery", true);

const connect = async () => {
    try {
        mongoose.set("strictQuery", false);
        await mongoose.connect(dbUrl);
        console.log("Database connected");
    } catch (error) {
        console.log(error);
        process.exit(1);
    }
};

export default connect;
