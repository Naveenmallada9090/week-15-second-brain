import mongoose, { model, Schema, Document } from "mongoose";
mongoose.connect("mongodb+srv://malladanaveen_db_user:oeIMlyK2zLEE7hXw@cluster0.wuw1buo.mongodb.net/?appName=Cluster0");
const UserSchema = new Schema({
    username: { type: String, unique: true },
    password: String
});
export const UserModel = model("User", UserSchema);
const ContentSchema = new Schema({
    type: String,
    link: String,
    tags: [{ type: mongoose.Types.ObjectId, ref: 'Tag' }],
    userId: { type: mongoose.Types.ObjectId, ref: 'User', required: true }
});
export const ContentModel = model("Content", ContentSchema);
//# sourceMappingURL=db.js.map