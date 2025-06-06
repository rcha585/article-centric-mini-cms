import express from "express";
import { getDatabase } from "../data/database.js";
import { requiresAuthentication } from "../middleware/authentication.js";

const router = express.Router();
export default router;

router.get("/", requiresAuthentication, async (req, res) => {
    const db = await getDatabase();
    const notifications = await db.all(`
        SELECT
            n.id,
            n.created_at,
            n.is_viewed,
            n.user_id,

            n.article_id,
            a.title AS article_title,
            a.content AS article_content,
            a.author_id AS author_id,
            au.username AS author_name,
            aa.avatar_path AS author_avatar_path,
            (SELECT COUNT(*) FROM subscriptions WHERE subscribed_user_id = a.author_id) AS author_subscriber_count,

            n.comment_id,
            c.content AS comment_content,
            c.user_id AS commenter_id,
            cu.username AS commenter_name,
            ca.avatar_path AS commenter_avatar_path,
            (SELECT COUNT(*) FROM subscriptions WHERE subscribed_user_id = c.user_id) AS commenter_subscriber_count

        FROM
            notifications AS n
        LEFT JOIN
            articles AS a ON n.article_id = a.id
        LEFT JOIN
            users AS au ON a.author_id = au.id
        LEFT JOIN
            avatars AS aa ON au.avatar_id = aa.id
        LEFT JOIN
            comments AS c ON n.comment_id = c.id
        LEFT JOIN
            users AS cu ON c.user_id = cu.id
        LEFT JOIN
            avatars AS ca ON cu.avatar_id = ca.id
        
        WHERE n.user_id = ?

        ORDER BY n.created_at DESC
    `, req.user.id);
    return res.status(200).json(notifications);
});

router.patch("/", requiresAuthentication, async (req, res) => {
  const db = await getDatabase();
  await db.run("UPDATE notifications SET is_viewed = 1 WHERE user_id = ?", req.user.id);
  return res.sendStatus(200);
});

router.patch("/:nid", requiresAuthentication, async (req, res) => {
  const db = await getDatabase();
  await db.run(
    "UPDATE notifications SET is_viewed = 1 WHERE id = ? AND user_id = ?",
    req.params.nid,
    req.user.id
  );
  return res.sendStatus(200);
});
