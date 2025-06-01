import dayjs from "dayjs";
import express from "express";
import { getDatabase } from "../data/database.js";
import { requiresAuthentication } from "../middleware/authentication.js";
import yup from "yup";

const router = express.Router();
export default router;

const createArticleSchema = yup.object({
    title: yup.string().max(100).required(),
    content: yup.string().required(),
    image_path: yup.string().max(100).required()
}).required();

router.post("/", requiresAuthentication, async (req, res) => {
  try {
    const {title, content, image_path} = req.body;
    const validatedInput = createArticleSchema.validateSync({title, content, image_path}, {abortEarly: false, stripUnknown: true});
    const db = await getDatabase();
    const created_at = dayjs().format("YYYY-MM-DD HH:mm:ss")
    const article = await db.run("INSERT INTO articles (title, content, created_at, image_path, author_id) VALUES(?, ?, ?, ?, ?)", validatedInput.title, validatedInput.content, created_at, validatedInput.image_path, req.user.id);
    const subscribed_users = await db.all("SELECT subscriber_user_id FROM subscriptions WHERE subscribed_user_id = ?", req.user.id);
    for (let i = 0; i < subscribed_users.length; i++) {
        await db.run("INSERT INTO notifications (created_at, user_id, article_id, comment_id) VALUES (?, ?, ?, ?)", created_at, subscribed_users[i].subscriber_user_id, article.lastID, null);
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

const createCommentSchema = yup.object({
    content: yup.string().required(),
    mentioned_user_ids: yup.array().of(yup.number().integer().positive()).required()
}).required();

router.post("/:aid/comments", requiresAuthentication, async (req, res) => {
  const {content, mentioned_user_ids} = req.body;
  const validatedInput = createCommentSchema.validateSync({content, mentioned_user_ids}, {abortEarly: false, stripUnknown: true});
  const db = await getDatabase();
  const article = await db.get("SELECT * FROM articles WHERE id = ?", req.params.aid);
  if (!article) {
    return res.sendStatus(404);
  }
  const created_at = dayjs().format("YYYY-MM-DD HH:mm:ss");
  const comment = await db.run("INSERT INTO comments (content, created_at, article_id, user_id) VALUES (?, ?, ?, ?)", validatedInput.content, created_at, req.params.aid, req.user.id);
  if (mentioned_user_ids && mentioned_user_ids.length > 0) {
    for (let i = 0; i < mentioned_user_ids.length; i++) {
      await db.run("INSERT INTO notifications (created_at, user_id, article_id, comment_id) VALUES (?, ?, ?, ?)", created_at, mentioned_user_ids[i], null, comment.lastID);
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

router.post("/:aid/likes", requiresAuthentication, async (req, res) => {
  try {
    const db = await getDatabase();
    await db.run("INSERT INTO likes (user_id, article_id) VALUES (?, ?)", req.user.id, req.params.aid);
    return res.sendStatus(200);
  } catch (error) {
    if (error.code == "SQLITE_CONSTRAINT") {
      return res.sendStatus(409);
    }
    return res.sendStatus(500);
  }
});

router.delete("/:aid/likes", requiresAuthentication, async (req, res) => {
  const db = await getDatabase();
  const result = await db.run("DELETE FROM likes WHERE user_id = ? AND article_id = ?", req.user.id, req.params.aid);
  if (result.changes == 0) {
    return res.sendStatus(404);
  }
  return res.sendStatus(200);
});

router.get("/:aid/likes", async (req, res) => {
  const db = await getDatabase();
  const likes = await db.all("SELECT u.username FROM likes AS l INNER JOIN users AS u ON l.user_id = u.id WHERE l.article_id = ?", req.params.aid);
  return res.status(200).json(likes);
});