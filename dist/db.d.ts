import mongoose from "mongoose";
import type { Document } from "mongoose";
export interface User extends Document {
    username: string;
    password: string;
}
export interface Content extends Document {
    type: string;
    link: string;
    title: string;
    tags: mongoose.Types.ObjectId[];
    userId: mongoose.Types.ObjectId;
}
export interface Link extends Document {
    hash: string;
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
export declare const LinkModel: mongoose.Model<Link, {}, {}, {}, mongoose.Document<unknown, {}, Link, {}, mongoose.DefaultSchemaOptions> & Link & Required<{
    _id: mongoose.Types.ObjectId;
}> & {
    __v: number;
} & {
    id: string;
}, any, Link>;
//# sourceMappingURL=db.d.ts.map