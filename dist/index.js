"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const utils_js_1 = require("./utils.js");
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const mongoose_1 = __importDefault(require("mongoose"));
const db_js_1 = require("./db.js");
const config_js_1 = require("./config.js");
const middleware_js_1 = require("./middleware.js");
const cors_1 = __importDefault(require("cors"));
const app = (0, express_1.default)();
app.use(express_1.default.json());
app.use((0, cors_1.default)());
app.post("/api/v1/signup", async (req, res) => {
    // TODO: zod validation , hash the password
    const username = req.body.username;
    const password = req.body.password;
    try {
        await db_js_1.UserModel.create({
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
    const existingUser = await db_js_1.UserModel.findOne({
        username,
        password
    });
    if (existingUser) {
        const token = jsonwebtoken_1.default.sign({
            id: existingUser._id
        }, config_js_1.JWT_PASSWORD);
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
app.post("/api/v1/content", middleware_js_1.userMiddleware, async (req, res) => {
    const link = req.body.link;
    const type = req.body.type;
    await db_js_1.ContentModel.create({
        link,
        type,
        title: req.body.title,
        userId: new mongoose_1.default.Types.ObjectId(Array.isArray(req.userId) ? req.userId[0] : req.userId),
        tags: []
    });
    res.json({
        message: "Content added"
    });
});
app.get("/api/v1/content", middleware_js_1.userMiddleware, async (req, res) => {
    const userId = Array.isArray(req.userId) ? req.userId[0] : req.userId;
    const content = await db_js_1.ContentModel.find({
        userId: new mongoose_1.default.Types.ObjectId(userId)
    }).populate("userId", "username");
    res.json({
        content
    });
});
app.delete("/api/v1/content", middleware_js_1.userMiddleware, async (req, res) => {
    const contentIdParam = req.body.contentId;
    const contentId = Array.isArray(contentIdParam) ? contentIdParam[0] : contentIdParam;
    const userId = Array.isArray(req.userId) ? req.userId[0] : req.userId;
    const content = await db_js_1.ContentModel.findOne({
        _id: new mongoose_1.default.Types.ObjectId(contentId),
        userId: new mongoose_1.default.Types.ObjectId(userId)
    });
    if (!content) {
        res.status(404).json({
            message: "Content not found or you don't have permission to delete it"
        });
        return;
    }
    await db_js_1.ContentModel.deleteOne({
        _id: new mongoose_1.default.Types.ObjectId(contentId)
    });
    res.json({
        message: "Deleted"
    });
});
app.post("/api/v1/brain/share", middleware_js_1.userMiddleware, async (req, res) => {
    const share = req.body.share;
    const userId = Array.isArray(req.userId) ? req.userId[0] : req.userId;
    if (share) {
        const existingLink = await db_js_1.LinkModel.findOne({
            userId: new mongoose_1.default.Types.ObjectId(userId)
        });
        if (existingLink) {
            res.json({
                hash: existingLink.hash
            });
            return;
        }
        const hash = (0, utils_js_1.random)(10);
        await db_js_1.LinkModel.create({
            userId: new mongoose_1.default.Types.ObjectId(userId),
            hash: hash
        });
        res.json({
            hash: hash
        });
    }
    else {
        await db_js_1.LinkModel.deleteOne({
            userId: new mongoose_1.default.Types.ObjectId(userId)
        });
    }
});
app.get("/api/v1/brain/:shareLink", async (req, res) => {
    const hash = req.params.shareLink;
    const link = await db_js_1.LinkModel.findOne({
        hash
    });
    if (!link) {
        res.status(411).json({
            message: "Sorry incorrect input"
        });
        return;
    }
    // userId
    const content = await db_js_1.ContentModel.find({
        userId: link.userId
    });
    console.log(link);
    const user = await db_js_1.UserModel.findOne({
        _id: link.userId
    });
    if (!user) {
        res.status(411).json({
            message: "user not found, error should ideally not happen"
        });
        return;
    }
    res.json({
        username: user.username,
        content: content
    });
});
app.listen(3000);
