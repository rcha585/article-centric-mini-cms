import express from "express";
import yup from "yup";
import { getDatabase } from "../data/database.js";
import { requiresAuthentication } from "../middleware/authentication.js";
import { createArticleSchema } from "../data/util.js";

const router = express.Router();

export default router;

router.post("/", requiresAuthentication, async (req, res) => {
  try {
    const {title, content, created_at, image_path} = req.body;
    const validatedInput = createArticleSchema.validateSync({title, content, created_at, image_path}, {abortEarly: false, stripUnknown: true});
    const db = await getDatabase();
    const article = await db.run("INSERT INTO articles (title, content, created_at, image_path, author_id) VALUES(?, ?, ?, ?, ?)", validatedInput.title, validatedInput.content, validatedInput.created_at, validatedInput.image_path, req.user.id);
    const subscribed_users = await db.all("SELECT subscriber_user_id FROM subscriptions WHERE subscribed_user_id = ?", req.user.id);
    for (let i = 0; i < subscribed_users.length; i++) {
        await db.run("INSERT INTO notifications (created_at, user_id, article_id, comment_id) VALUES (?, ?, ?, ?)", validatedInput.created_at, subscribed_users[i].subscriber_user_id, article.lastID, null);
    }
    return res.sendStatus(201);
  } catch (error) {
    if (error instanceof yup.ValidationError) {
      return res.status(400).json({errors: error.errors});
    } else {
      return res.sendStatus(500);
    }
  }
});

router.get("/", async (req, res) => {
    const db = await getDatabase();
    const articles = await db.all("SELECT * FROM articles");
    return res.status(200).json(articles);
})