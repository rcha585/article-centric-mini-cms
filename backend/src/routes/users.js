import express from "express";
import yup from "yup";
import { getDatabase } from "../data/database.js";
import { createUserSchema, encryptPassword } from "../data/util.js";
import { requiresAuthentication } from "../middleware/authentication.js";

const router = express.Router();

export default router;

router.post("/", async (req, res) => {
  try {
    const {username, password, first_name, last_name, date_of_birth, description, avatar_path} = req.body;
    const validatedInput = createUserSchema.validateSync({username, password, first_name, last_name, date_of_birth, description, avatar_path}, {abortEarly: false, stripUnknown: true});
    const db = await getDatabase();
    const encryptedPassword = await encryptPassword(validatedInput.password);
    await db.run("INSERT INTO users (username, password, first_name, last_name, date_of_birth, description, avatar_path) VALUES (?, ?, ?, ?, ?, ?, ?)", validatedInput.username, encryptedPassword, validatedInput.first_name, validatedInput.last_name, validatedInput.date_of_birth, validatedInput.description, validatedInput.avatar_path);
    return res.sendStatus(201);
  } catch (error) {
    if (error instanceof yup.ValidationError) {
      return res.status(400).json({errors: error.errors});
    } else {
      return res.sendStatus(500);
    }
  }
});

router.get("/", requiresAuthentication, async (req, res) => {
  if (req.user.is_admin == 0) {
    return res.sendStatus(403);
  }
  const db = await getDatabase();
  const users = await db.all("SELECT id, username, first_name, last_name, date_of_birth, description, avatar_path FROM users");
  return res.status(200).json(users);
});

router.get("/:uid/articles", requiresAuthentication, async (req, res) => {
  const db = await getDatabase();
  const articles = await db.all("SELECT * FROM articles WHERE author_id = ?", req.params.uid);
  return res.status(200).json(articles);
});