import express from "express";
import type { Request, Response } from "express";
import { userMiddleware } from "./middleware.js";
import mongoose from "mongoose";
import jwt from "jsonwebtoken";
import { UserModel, ContentModel, LinkModel } from "./db.js";
import { JWT_PASSWORD } from "./config.js";
import { random } from "./utils.js";

const app = express();
app.use(express.json());

app.post("/api/v1/signup", async (req: Request, res: Response) => {
    const username = req.body.username;
    const password = req.body.password;

    try {
        await UserModel.create({
            username: username,
            password: password
        })

        res.json({
            message: "User signed up"
        })
    } catch(e) {
        res.status(411).json({
            message: "User already exists"
        })
    }
})

app.post("/api/v1/signin", async (req: Request, res: Response) => {
    const username = req.body.username;
    const password = req.body.password;

    const existingUser = await UserModel.findOne({
        username,
        password
    })
    if (existingUser) {
        const token = jwt.sign({
            id: existingUser._id
        }, JWT_PASSWORD)

        res.json({
            token
        })
    } else {
        res.status(403).json({
            message: "Incorrect credentials"
        })
    }
})

app.post("/api/v1/content", userMiddleware, async (req: Request, res: Response) => {
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
         title: req.body.title,
         userId: objectId,
         tags: []
     });

     res.json({
         message: "Content added"
     });
 });

app.get("/api/v1/content", userMiddleware, async (req: Request, res: Response) => {
    const userId = req.userId;
    if (!userId) {
        return res.status(401).json({ message: "Unauthorized" });
    }
    const objectId = new mongoose.Types.ObjectId(userId);
    const content = await ContentModel.find({
        userId: objectId
    }).populate ("userId", "username password")
    res.json({
        content
    });
});

app.delete("/api/v1/content", userMiddleware, async (req: Request, res: Response) => {
    const contentId = req.body.contentId;
    if (!contentId) {
        return res.status(400).json({ message: "contentId is required" });
    }

    const userId = req.userId;
    if (!userId) {
        return res.status(401).json({ message: "Unauthorized" });
    }

    try {
        const objectId = new mongoose.Types.ObjectId(contentId);
        const userObjectId = new mongoose.Types.ObjectId(userId);
        await ContentModel.deleteOne({ _id: objectId, userId: userObjectId });
        res.json({ message: "Deleted" });
    } catch (err) {
        return res.status(400).json({ message: "Invalid contentId or userId" });
    }
});

app.post("/api/v1/brain/share", userMiddleware, async (req: Request, res: Response) => {
      const userId = req.userId;
      if (!userId) {
          return res.status(401).json({ message: "Unauthorized" });
      }
      const share = req.body.share;
      if (share) {
            const existingLink = await LinkModel.findOne({
                userId: userId
            });

            if (existingLink) {
                 res.json({
                     hash: existingLink.hash
                })
                return;
            }
            const hash = random(10);
            await LinkModel.create({
                userId: userId,
                hash: hash
            })

            res.json({
                hash
            }) 
      } else {
          await LinkModel.deleteOne({
              userId: userId
          });

          res.json({
              message: "Removed link"
          })
        }
  });

app.get("/api/v1/brain/:shareLink", async (req: Request, res: Response) => {
    const hash = req.params.shareLink as string;

    const link = await LinkModel.findOne({
        hash
    });

    if (!link) {
        res.status(411).json({
            message: "Sorry incorrect input"
        })
        return;
    }

    const content = await ContentModel.find({
        userId: link.userId
    })
    
    console.log(link);
    const user = await UserModel.findOne({
        _id: link.userId
    })

    if (!user) {
        res.status(411).json({
            message: "user not found, error should ideally not happen"
        })
        return;
    }

    res.json({
        username: user.username,
        content: content
    })
});

app.listen(3000);

console.log("mongo connected");