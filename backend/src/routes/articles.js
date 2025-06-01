import express from "express";
import yup from "yup";
import { getDatabase } from "../data/database.js";
import { requiresAuthentication } from "../middleware/authentication.js";
import { createArticleSchema, createCommentSchema } from "../data/util.js";

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
});

// get one article
router.get("/:aid", async (req, res) => {
  const db = await getDatabase();
  const article = await db.get("SELECT * FROM articles WHERE id = ?", req.params.aid);
  if (!article) {
    return res.sendStatus(404);
  }
  // future extension, users, tags, comments, likes...
  return res.status(200).json(article);
});

// edit article, only author can edit
router.put("/:aid", requiresAuthentication, async (req, res) => {
  const { title, content, image_path } = req.body;
  const db = await getDatabase();
  const article = await db.get("SELECT * FROM articles WHERE id = ?", req.params.aid);
  if (!article) return res.sendStatus(404);
  // if not the author, return 403 forbidden.
  if (article.author_id !== req.user.id) {
    return res.sendStatus(403);
  }
  await db.run(
    "UPDATE articles SET title=?, content=?, image_path=? WHERE id=?",
    title, content, image_path, req.params.aid
  );
  return res.sendStatus(200);
});

router.post("/:aid/comments", requiresAuthentication, async (req, res) => {
  const {content, created_at, mentioned_user_ids} = req.body;
  const validatedInput = createCommentSchema.validateSync({content, created_at, mentioned_user_ids}, {abortEarly: false, stripUnknown: true});
  const db = await getDatabase();
  const article = await db.get("SELECT * FROM articles WHERE id = ?", req.params.aid);
  if (!article) {
    return res.sendStatus(404);
  }
  const comment = await db.run("INSERT INTO comments (content, created_at, article_id, user_id) VALUES (?, ?, ?, ?)", validatedInput.content, validatedInput.created_at, req.params.aid, req.user.id);
  if (mentioned_user_ids && mentioned_user_ids.length > 0) {
    for (let i = 0; i < mentioned_user_ids.length; i++) {
      await db.run("INSERT INTO notifications (created_at, user_id, article_id, comment_id) VALUES (?, ?, ?, ?)", validatedInput.created_at, mentioned_user_ids[i], null, comment.lastID);
    }
  }
  return res.sendStatus(201);
});

router.get("/:aid/comments", async (req, res) => {
  const db = await getDatabase();
  const article = await db.get("SELECT * FROM articles WHERE id = ?", req.params.aid);
  if (!article) {
    return res.sendStatus(404);
  }
  const comments = await db.all("SELECT c.content, c.created_at, u.username FROM comments AS c, users AS u WHERE c.user_id = u.id AND c.article_id = ? ORDER BY c.created_at ASC", req.params.aid);
  return res.status(200).json(comments);
});