import express from "express";
import { userMiddleware } from "./middleware.js";
import mongoose from "mongoose";
import jwt from "jsonwebtoken";
import { UserModel, ContentModel } from "./db.js";
import { JWT_PASSWORD } from "./config.js";
const app = express();
app.use(express.json());
app.post("/api/v1/signup", async (req, res) => {
    const username = req.body.username;
    const password = req.body.password;
    try {
        await UserModel.create({
            username: username,
            password: password
        });
        res.json({
            message: "User signed up"
        });
    }
    catch (e) {
        res.status(411).json({
            message: "User already exists"
        });
    }
});
app.post("/api/v1/signin", async (req, res) => {
    const username = req.body.username;
    const password = req.body.password;
    const existingUser = await UserModel.findOne({
        username,
        password
    });
    if (existingUser) {
        const token = jwt.sign({
            id: existingUser._id
        }, JWT_PASSWORD);
        res.json({
            token
        });
    }
    else {
        res.status(403).json({
            message: "Incorrect credentials"
        });
    }
});
app.post("/api/v1/content", userMiddleware, async (req, res) => {
    const link = req.body.link;
    const type = req.body.type;
    const userId = req.userId;
    if (!userId) {
        return res.status(401).json({ message: "Unauthorized" });
    }
    const objectId = new mongoose.Types.ObjectId(userId);
    await ContentModel.create({
        link,
        type,
        userId: objectId,
        tags: []
    });
    res.json({
        message: "Content added"
    });
});
app.get("/api/v1/content", userMiddleware, async (req, res) => {
    const userId = req.userId;
    if (!userId) {
        return res.status(401).json({ message: "Unauthorized" });
    }
    const objectId = new mongoose.Types.ObjectId(userId);
    const content = await ContentModel.find({
        userId: objectId
    }).populate("userId", "username password");
    res.json({
        content
    });
});
app.delete("/api/v1/content", userMiddleware, async (req, res) => {
    const contentId = req.body.contentId;
    if (!contentId) {
        return res.status(400).json({ message: "contentId is required" });
    }
    try {
        const objectId = new mongoose.Types.ObjectId(contentId);
        const userId = new mongoose.Types.ObjectId(req.userId);
        await ContentModel.deleteOne({ _id: objectId, userId });
        res.json({ message: "Deleted" });
    }
    catch (err) {
        return res.status(400).json({ message: "Invalid contentId or userId" });
    }
});
app.post("/api/v1/brain/share", (req, res) => {
});
app.get("/api/v1/brain/:shareLink", (req, res) => {
});
app.listen(3000);
console.log("mongo connected");
//# sourceMappingURL=index.js.map