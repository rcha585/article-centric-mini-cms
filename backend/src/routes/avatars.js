import express from "express";
import { getDatabase } from "../data/database.js";

const router = express.Router();
export default router;

router.get("/", async (req, res) => {
    const db = await getDatabase();
    const avatars = await db.all("SELECT * FROM avatars");
    return res.status(200).json(avatars);
})