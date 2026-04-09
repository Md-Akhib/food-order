import mongoose from "mongoose";

const url = process.env.MONGODB_URL;

const mongodb = async () => {
    try {
        await mongoose.connect(url);
        console.log("Connection Sucessful");
    } catch (error) {
        console.log("Not Connected ", error);
        process.exit(1);
    }
}

export default mongodb