import { config } from "dotenv";
config();
import mongoose, { model, Schema } from "mongoose";

// Connect to MongoDB with error handling
const connectDB = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI!);
        console.log("Connected to MongoDB");
    } catch (error) {
        console.error("MongoDB connection error:", error);
        process.exit(1);
    }
};

// Call the connection function
connectDB();

// Define schemas and models
const UserSchema = new Schema({
    username: {type: String, unique: true},
    password: String
});

export const UserModel = model("User", UserSchema);

const ContentSchema = new Schema({
    title: String,
    link: String,
    tags: [{type: mongoose.Types.ObjectId, ref: "Tag"}],
    type: String,
    userId: {type: mongoose.Types.ObjectId, ref: "User", required: true },
});

const LinkSchema = new Schema({
    hash: String,
    userId: {type: mongoose.Types.ObjectId, ref: "User", required: true, unique: true },
});

export const LinkModel = model("Links", LinkSchema);
export const ContentModel = model("Content", ContentSchema);
