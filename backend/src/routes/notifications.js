import express from "express";
import { getDatabase } from "../data/database.js";
import { requiresAuthentication } from "../middleware/authentication.js";

const router = express.Router();

export default router;

router.get("/", requiresAuthentication, async (req, res) => {
    const db = await getDatabase();
    const notifications = await db.all("SELECT * FROM notifications WHERE user_id = ? ORDER BY created_at ASC", req.user.id);
    return res.status(200).json(notifications);
});