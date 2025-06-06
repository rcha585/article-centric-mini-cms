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
