import mongoose, { Document } from "mongoose";
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
export declare const UserModel: mongoose.Model<User, {}, {}, {}, mongoose.Document<unknown, {}, User, {}, mongoose.DefaultSchemaOptions> & User & Required<{
    _id: mongoose.Types.ObjectId;
}> & {
    __v: number;
} & {
    id: string;
}, any, User>;
export declare const ContentModel: mongoose.Model<Content, {}, {}, {}, mongoose.Document<unknown, {}, Content, {}, mongoose.DefaultSchemaOptions> & Content & Required<{
    _id: mongoose.Types.ObjectId;
}> & {
    __v: number;
} & {
    id: string;
}, any, Content>;
//# sourceMappingURL=db.d.ts.map