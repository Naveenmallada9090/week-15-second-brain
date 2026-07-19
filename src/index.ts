import express from "express";
import { random } from "./utils.js";
import jwt from "jsonwebtoken";
import mongoose from "mongoose";
import { ContentModel, LinkModel, UserModel } from "./db.js";
import { JWT_PASSWORD } from "./config.js";
import { userMiddleware } from "./middleware.js";
import cors from "cors";

const app = express();
app.use(express.json());
app.use(cors());

app.post("/api/v1/signup", async (req, res) => {
    // TODO: zod validation , hash the password
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
    } catch(e) {
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
    } else {
        res.status(403).json({
            message: "Incorrect credentials"
        });
    }
});

app.post("/api/v1/content", userMiddleware, async (req, res) => {
    const link = req.body.link;
    const type = req.body.type;
    await ContentModel.create({
      link,
      type,
      title: req.body.title,
      userId: new mongoose.Types.ObjectId(Array.isArray(req.userId) ? req.userId[0] : req.userId),
      tags: [] as any[]
    });

    res.json({
        message: "Content added"
    });
});



app.get("/api/v1/content", userMiddleware, async (req, res) => {
    const userId = Array.isArray(req.userId) ? req.userId[0] : req.userId;
    const content = await ContentModel.find({
        userId: new mongoose.Types.ObjectId(userId)
    }).populate("userId", "username");
    res.json({
        content
    });
});

app.delete("/api/v1/content", userMiddleware, async (req, res) => {
    const contentIdParam = req.body.contentId;
    const contentId = Array.isArray(contentIdParam) ? contentIdParam[0] : contentIdParam;
    const userId = Array.isArray(req.userId) ? req.userId[0] : req.userId;
    const content = await ContentModel.findOne({
        _id: new mongoose.Types.ObjectId(contentId),
        userId: new mongoose.Types.ObjectId(userId)
    });

    if (!content) {
        res.status(404).json({
            message: "Content not found or you don't have permission to delete it"
        });
        return;
    }

    await ContentModel.deleteOne({
        _id: new mongoose.Types.ObjectId(contentId)
    });

    res.json({
        message: "Deleted"
    });
});




app.post("/api/v1/brain/share", userMiddleware, async (req, res) => {
    const share = req.body.share;
    const userId = Array.isArray(req.userId) ? req.userId[0] : req.userId;
    if (share) {
        const existingLink = await LinkModel.findOne({
            userId: new mongoose.Types.ObjectId(userId!)
        });
        if (existingLink) {
            res.json({
                hash: existingLink.hash
            });
            return;
        }
        const hash = random(10);
        await LinkModel.create({
            userId: new mongoose.Types.ObjectId(userId!),
            hash: hash
        });

        res.json({
            hash: hash
        });
    } else {
        await LinkModel.deleteOne({
            userId: new mongoose.Types.ObjectId(userId!)
        });
    }
});

app.get("/api/v1/brain/:shareLink", async (req, res) => {
    const hash = req.params.shareLink;

    const link = await LinkModel.findOne({
        hash
    });

    if (!link) {
        res.status(411).json({
            message: "Sorry incorrect input"
        });
        return;
    }
    // userId
    const content = await ContentModel.find({
        userId: link.userId
    });

    console.log(link);
    const user = await UserModel.findOne({
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