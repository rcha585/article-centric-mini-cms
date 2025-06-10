import express from "express";
import { getDatabase } from "../data/database.js";
import { requiresAuthentication } from "../middleware/authentication.js";

const router = express.Router();
export default router;

router.get("/articles", requiresAuthentication, async (req, res) => {
    const db = await getDatabase();
    const notifications = await db.all(`
        SELECT
            n.id,
            n.created_at,
            n.is_viewed,
            n.is_read,
            n.user_id,  
            n.article_id, 
            a.title AS article_title,
            a.content AS article_content,
            a.author_id AS author_id,
            au.username AS author_name,
            aa.avatar_path AS author_avatar_path,
            (SELECT COUNT(*) FROM subscriptions WHERE subscribed_user_id = a.author_id) AS author_subscriber_count

        FROM
            notifications AS n
        JOIN
            articles AS a ON n.article_id = a.id
        JOIN
            users AS au ON a.author_id = au.id
        JOIN
            avatars AS aa ON au.avatar_id = aa.id
        
        WHERE n.user_id = ?

        ORDER BY n.created_at DESC
    `, req.user.id);
    return res.status(200).json(notifications);
});

router.get("/comments", requiresAuthentication, async (req, res) => {
    const db = await getDatabase();
    const notifications = await db.all(`
    WITH author_subs AS (
        SELECT s.subscribed_user_id AS author_id, COUNT(*) AS author_subscriber_count
        FROM subscriptions s
        GROUP BY s.subscribed_user_id
      ),
      commenter_subs AS (
        SELECT s.subscribed_user_id AS commenter_id, COUNT(*) AS commenter_subscriber_count
        FROM subscriptions s
        GROUP BY s.subscribed_user_id
      )
      SELECT 
        n.id,
        n.created_at,
        n.is_viewed,
        n.is_read,
        n.user_id,
        
        a.id AS article_id,
        a.title AS article_title,
        a.content AS article_content,
        u2.id AS author_id,
        u2.username AS author_name,
        t2.avatar_path AS author_avatar_path,
        author_subs.author_subscriber_count,
        
        c.id AS comment_id,
        c.content AS comment_content,
        c.user_id AS commenter_id,
        u1.username AS commenter_name,
        t1.avatar_path AS commenter_avatar_path,
        commenter_subs.commenter_subscriber_count
      
      FROM notifications n
      JOIN comments c ON c.id = n.comment_id
      JOIN users u1 ON u1.id = c.user_id
      JOIN avatars t1 ON t1.id = u1.avatar_id
      JOIN articles a ON a.id = c.article_id
      JOIN users u2 ON u2.id = a.author_id
      JOIN avatars t2 ON t2.id = u2.avatar_id
      
      LEFT JOIN author_subs ON u2.id = author_subs.author_id
      LEFT JOIN commenter_subs ON u1.id = commenter_subs.commenter_id
      
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
    "UPDATE notifications SET is_read = 1 WHERE id = ? AND user_id = ?",
    req.params.nid,
    req.user.id
  );
  return res.sendStatus(200);
});
