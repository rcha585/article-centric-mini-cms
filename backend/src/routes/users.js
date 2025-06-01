import bcrypt from "bcrypt";
import express from "express";
import { getDatabase } from "../data/database.js";
import { requiresAuthentication } from "../middleware/authentication.js";
import yup from "yup";

const router = express.Router();
export default router;

const createUserSchema = yup.object({
  username: yup.string().max(100).required(),
  password: yup.string().max(100).required(),
  first_name: yup.string().max(100).required(),
  last_name: yup.string().max(100).required(),
  date_of_birth: yup.string().matches(/^\d{4}-\d{2}-\d{2} \d{2}:\d{2}:\d{2}$/, "Invalid date format (YYYY-MM-DD HH:mm:ss)").required(),
  description: yup.string().max(255).required(),
  avatar_path: yup.string().max(255).required()
}).required();

async function encryptPassword(password) {
    const encryptedPassword = await bcrypt.hash(password, 10);
    return encryptedPassword;
}

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
    }
    if (error.code == "SQLITE_CONSTRAINT") {
      return res.sendStatus(409);
    }
    return res.sendStatus(500);
  }
});

router.get("/", requiresAuthentication, async (req, res) => {
  if (req.user.is_admin) {
    const db = await getDatabase();
    const users = await db.all("SELECT id, username, first_name, last_name, date_of_birth, description, avatar_path FROM users");
    return res.status(200).json(users);
  }
  if (!req.query.username) {
    return res.sendStatus(403);
  }
  if (req.query.username) {
    const db = await getDatabase();
    const user = await db.get("SELECT id, username FROM users WHERE username = ?", req.query.username);
    if (user == null) {
      return res.sendStatus(404);
    } else {
      return res.status(200).json(user);
    }
  }
});

router.get("/:uid/articles", requiresAuthentication, async (req, res) => {
  const db = await getDatabase();
  const articles = await db.all("SELECT * FROM articles WHERE author_id = ?", req.params.uid);
  return res.status(200).json(articles);
});

const editUserSchema = yup.object({
  username: yup.string().max(100),
  password: yup.string().max(100),
  first_name: yup.string().max(100),
  last_name: yup.string().max(100),
  date_of_birth: yup.string().matches(/^\d{4}-\d{2}-\d{2} \d{2}:\d{2}:\d{2}$/, "Invalid date format (YYYY-MM-DD HH:mm:ss)"),
  description: yup.string().max(255),
  avatar_path: yup.string().max(255)
}).required();

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