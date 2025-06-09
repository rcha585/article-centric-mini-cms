import dayjs from "dayjs";
import express from "express";
import { getDatabase } from "../data/database.js";
import { requiresAuthentication } from "../middleware/authentication.js";
import yup from "yup";

const router = express.Router();
export default router;

const editCommentSchema = yup
  .object({
    content: yup.string(),
    mentioned_user_ids: yup.array().of(yup.number().integer().positive())
  })
  .required();

router.patch("/:cid", requiresAuthentication, async (req, res) => {
  const { content, mentioned_user_ids } = req.body;
  const validatedInput = editCommentSchema.validateSync(
    { content, mentioned_user_ids },
    { abortEarly: false, stripUnknown: true }
  );
  const db = await getDatabase();
  const comment = await db.get("SELECT * FROM comments WHERE id = ?", req.params.cid);
  if (!comment) {
    return res.sendStatus(404);
  }
  if (req.user.id != comment.user_id) {
    return res.sendStatus(403);
  }
  const newContent = validatedInput.content ?? comment.content;
  await db.run("UPDATE comments SET content = ? WHERE id = ?", newContent, req.params.cid);
  await db.run("DELETE FROM notifications WHERE comment_id = ?", req.params.cid);
  if (validatedInput.mentioned_user_ids && validatedInput.mentioned_user_ids.length > 0) {
    for (let i = 0; i < validatedInput.mentioned_user_ids.length; i++) {
      await db.run(
        "INSERT INTO notifications (created_at, user_id, article_id, comment_id) VALUES (?, ?, ?, ?)",
        dayjs().format("YYYY-MM-DD HH:mm:ss"),
        validatedInput.mentioned_user_ids[i],
        null,
        req.params.cid
      );
    }
  }
  return res.sendStatus(200);
});

router.delete("/:cid", requiresAuthentication, async (req, res) => {
  const db = await getDatabase();
  const comment = await db.get("SELECT * FROM comments WHERE id = ?", req.params.cid);
  if (!comment) {
    return res.sendStatus(404);
  }
  if (req.user.id != comment.user_id) {
    return res.sendStatus(403);
  }
  await db.run("DELETE FROM comments WHERE id = ?", req.params.cid);
  await db.run("DELETE FROM notifications WHERE comment_id = ?", req.params.cid);
  return res.sendStatus(204);
});

router.get("/user/:uid", requiresAuthentication, async (req, res) => {
  if (+req.params.uid !== req.user.id) return res.sendStatus(403);

  const db = await getDatabase();
  const rows = await db.all(`
    SELECT
      c.id AS comment_id,
      c.content AS comment_content,
      c.created_at AS comment_created_at,
      c.article_id,
      a.title AS article_title
    FROM comments AS c
    JOIN articles AS a ON a.id = c.article_id
    WHERE c.user_id = ?
    ORDER BY c.created_at DESC`, req.user.id);

  res.json(rows);
});

router.get("/:cid", async (req, res) => {
  const db = await getDatabase();
  const response = await db.get(`
    SELECT
      a.id AS article_id,
      a.title AS article_title,
      a.content AS article_content,
      a.created_at AS article_created_at,
      a.image_path AS article_image_path,
      a.author_id AS author_id,
      au.username AS author_username,
      (SELECT COUNT(*) FROM subscriptions WHERE subscribed_user_id = a.author_id) AS author_subscriber_count,
      c.id AS comment_id,
      c.content AS comment_content,
      c.created_at AS comment_created_at,
      c.user_id AS commenter_id,
      cu.username AS commenter_username,
      (SELECT COUNT(*) FROM subscriptions WHERE subscribed_user_id = c.user_id) AS commenter_subscriber_count
    FROM
      comments AS c
    INNER JOIN
      articles AS a ON c.article_id = a.id
    INNER JOIN
      users AS au ON a.author_id = au.id
    INNER JOIN
      users AS cu ON c.user_id = cu.id
    WHERE
      c.id = ?`, req.params.cid);
  return res.status(200).json(response);
});

router.get("/:cid/tagged_users", async (req, res) => {
  const db = await getDatabase();
  const tagged_users = await db.all(`
    SELECT
      u.id,
      u.username,
      u.avatar_id,
      a.avatar_path,
      (SELECT COUNT(*) FROM subscriptions WHERE subscribed_user_id = u.id) AS total_subscriptions
    FROM
      notifications AS n
    LEFT JOIN
      users AS u
    ON
      n.user_id = u.id
    LEFT JOIN
      avatars AS a
    ON
      u.avatar_id = a.id
    WHERE
      n.comment_id = ?
    `, req.params.cid
  );
  return res.status(200).json(tagged_users);
});