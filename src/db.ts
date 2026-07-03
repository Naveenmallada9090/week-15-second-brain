
import mongoose, { model, Schema, Document } from "mongoose";

export interface User extends Document {
    username: string;
    password: string;
}

export interface Content extends Document {
    type: string;
    link: string;
    tags: mongoose.Types.ObjectId[];
    userId: mongoose.Types.ObjectId;
}

mongoose.connect("mongodb+srv://malladanaveen_db_user:oeIMlyK2zLEE7hXw@cluster0.wuw1buo.mongodb.net/?appName=Cluster0");

const UserSchema = new Schema<User>({
    username: {type: String, unique: true},
    password: String
})

export const UserModel = model<User>("User", UserSchema);

const ContentSchema = new Schema<Content> ({
    type: String,
    link: String,
    tags: [{type: mongoose.Types.ObjectId, ref: 'Tag'}],
    userId: {type: mongoose.Types.ObjectId, ref: 'User', required: true }
})

export const ContentModel = model<Content>("Content", ContentSchema); 