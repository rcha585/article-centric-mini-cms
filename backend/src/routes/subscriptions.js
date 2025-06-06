import express from "express";
import { getDatabase } from "../data/database.js";
import { requiresAuthentication } from "../middleware/authentication.js";

const router = express.Router();
export default router;

router.post("/:target_uid", requiresAuthentication, async (req, res) => {
  try {
    const db = await getDatabase();
    await db.run(
      "INSERT INTO subscriptions (subscriber_user_id, subscribed_user_id) VALUES (?, ?)",
      req.user.id,
      req.params.target_uid
    );
    return res.sendStatus(201);
  } catch (error) {
    if (error.code == "SQLITE_CONSTRAINT") {
      return res.sendStatus(409);
    }
    return res.sendStatus(500);
  }
});

router.delete("/:target_uid", requiresAuthentication, async (req, res) => {
  const db = await getDatabase();
  const result = await db.run(
    "DELETE FROM subscriptions WHERE subscriber_user_id = ? AND subscribed_user_id = ?",
    req.user.id,
    req.params.target_uid
  );
  if (result.changes == 0) {
    return res.sendStatus(404);
  }
  return res.sendStatus(200);
});
