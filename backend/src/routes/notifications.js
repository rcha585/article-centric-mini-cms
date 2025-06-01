import express from "express";
import { getDatabase } from "../data/database.js";
import { requiresAuthentication } from "../middleware/authentication.js";

const router = express.Router();
export default router;

router.get("/", requiresAuthentication, async (req, res) => {
    const db = await getDatabase();
    const notifications = await db.all("SELECT n.id, n.created_at, n.is_viewed, n.article_id, n.comment_id, a.title AS article_title, a.content AS article_content, c.content AS comment_content FROM notifications AS n LEFT JOIN articles AS a ON n.article_id = a.id LEFT JOIN comments AS c ON n.comment_id = c.id WHERE n.user_id = ?", req.user.id);
    return res.status(200).json(notifications);
});

router.patch("/", requiresAuthentication, async (req, res) => {
    const db = await getDatabase();
    await db.run("UPDATE notifications SET is_viewed = 1 WHERE user_id = ?", req.user.id);
    return res.sendStatus(200);
});

router.patch("/:nid", requiresAuthentication, async (req, res) => {
    const db = await getDatabase();
    await db.run("UPDATE notifications SET is_viewed = 1 WHERE id = ? AND user_id = ?", req.params.nid, req.user.id);
    return res.sendStatus(200);
});