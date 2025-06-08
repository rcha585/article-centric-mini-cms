import bcrypt from "bcrypt";
import express from "express";
import { getDatabase } from "../data/database.js";
import { requiresAuthentication } from "../middleware/authentication.js";
import yup from "yup";

const router = express.Router();
export default router;

const createUserSchema = yup
  .object({
    username: yup.string().max(100).required(),
    password: yup.string().max(100).required(),
    first_name: yup.string().max(100).required(),
    last_name: yup.string().max(100).required(),
    date_of_birth: yup
      .string()
      .matches(/^\d{4}-\d{2}-\d{2}$/, "Invalid date format (YYYY-MM-DD)")
      .required(),
    description: yup.string().max(255).required(),
    avatar_id: yup.number().integer().positive().required()
  })
  .required();

async function encryptPassword(password) {
  const encryptedPassword = await bcrypt.hash(password, 10);
  return encryptedPassword;
}

router.post("/", async (req, res) => {
  try {
    const { username, password, first_name, last_name, date_of_birth, description, avatar_id } =
      req.body;
    const validatedInput = createUserSchema.validateSync(
      { username, password, first_name, last_name, date_of_birth, description, avatar_id },
      { abortEarly: false, stripUnknown: true }
    );
    const db = await getDatabase();
    const encryptedPassword = await encryptPassword(validatedInput.password);
    await db.run(
      "INSERT INTO users (username, password, first_name, last_name, date_of_birth, description, avatar_id) VALUES (?, ?, ?, ?, ?, ?, ?)",
      validatedInput.username,
      encryptedPassword,
      validatedInput.first_name,
      validatedInput.last_name,
      validatedInput.date_of_birth,
      validatedInput.description,
      validatedInput.avatar_id
    );
    return res.sendStatus(201);
  } catch (error) {
    if (error instanceof yup.ValidationError) {
      return res.status(400).json({ errors: error.errors });
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
    const users = await db.all(
      "SELECT u.id, u.username, u.first_name, u.last_name, u.date_of_birth, u.description, a.avatar_path FROM users AS u LEFT JOIN avatars AS a ON u.avatar_id = a.id"
    );
    return res.status(200).json(users);
  }
  if (!req.query.username) {
    return res.sendStatus(403);
  }
  if (req.query.username) {
    const db = await getDatabase();
    const user = await db.get(
      "SELECT id, username, avatar_id FROM users WHERE username = ?",
      req.query.username
    );
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

const editUserSchema = yup
  .object({
    username: yup.string().max(100),
    password: yup.string().max(100),
    first_name: yup.string().max(100),
    last_name: yup.string().max(100),
    date_of_birth: yup.string().matches(/^\d{4}-\d{2}-\d{2}$/, "Invalid date format (YYYY-MM-DD)"),
    description: yup.string().max(255),
    avatar_id: yup.number().integer().positive()
  })
  .required();

router.patch("/", requiresAuthentication, async (req, res) => {
  try {
    const { username, password, first_name, last_name, date_of_birth, description, avatar_id } =
      req.body;
    const validatedInput = editUserSchema.validateSync(
      { username, password, first_name, last_name, date_of_birth, description, avatar_id },
      { abortEarly: false, stripUnknown: true }
    );
    const db = await getDatabase();
    const user = await db.get("SELECT * FROM users WHERE id = ?", req.user.id);
    if (!user) {
      return req.sendStatus(404);
    }
    const newUsername = validatedInput.username ?? user.username;
    const newPassword = validatedInput.password
      ? await encryptPassword(validatedInput.password)
      : user.password;
    const newFirstName = validatedInput.first_name ?? user.first_name;
    const newLastName = validatedInput.last_name ?? user.last_name;
    const newDateOfBirth = validatedInput.date_of_birth ?? user.date_of_birth;
    const newDescription = validatedInput.description ?? user.description;
    const newAvatarId = validatedInput.avatar_id ?? user.avatar_id;
    await db.run(
      "UPDATE users SET username = ?, password = ?, first_name = ?, last_name = ?, date_of_birth = ?, description = ?, avatar_id = ? WHERE id = ?",
      newUsername,
      newPassword,
      newFirstName,
      newLastName,
      newDateOfBirth,
      newDescription,
      newAvatarId,
      req.user.id
    );
    return res.sendStatus(200);
  } catch (error) {
    if (error instanceof yup.ValidationError) {
      return res.status(400).json({ errors: error.errors });
    }
    if (error.code == "SQLITE_CONSTRAINT") {
      return res.sendStatus(409);
    }
    return res.sendStatus(500);
  }
});

router.delete("/:uid", requiresAuthentication, async (req, res) => {
  if (!req.user.is_admin && req.user.id != req.params.uid) {
    return res.sendStatus(403);
  }
  const db = await getDatabase();
  const user = await db.get("SELECT * FROM users WHERE id = ?", req.params.uid);
  if (!user) {
    return res.sendStatus(404);
  }
  await db.run("DELETE FROM users WHERE id = ?", req.params.uid);
  return res.sendStatus(204);
});

router.get("/:uid/subscriptions", async (req, res) => {
  const db = await getDatabase();
  const subscribed_user = await db.get("SELECT * FROM users WHERE id = ?", req.params.uid);
  if (!subscribed_user) {
    return res.sendStatus(404);
  }
  const subscribers = await db.all("SELECT u.username FROM subscriptions AS s INNER JOIN users AS u ON s.subscriber_user_id = u.id WHERE s.subscribed_user_id = ?", req.params.uid);
  return res.status(200).json(subscribers); 
});

router.get("/:uid", async (req, res) => {
  const db = await getDatabase();
  const user = await db.get(
    "SELECT id, username, first_name, last_name, avatar_id FROM users WHERE id = ?", req.params.uid
  );
  if (!user) return res.sendStatus(404);
  res.status(200).json(user);
});

router.get("/check/username", async (req, res) => {
  if (!req.query.username) {
    return res.sendStatus(400);
  }
  const db = await getDatabase();
  const username = await db.get(`
    SELECT
      *
    FROM
      users
    WHERE
      username = ? COLLATE NOCASE
    `, req.query.username
  );
  if (!username) {
    return res.status(200).json({available: true});
  } else {
    return res.status(200).json({available: false});
  }
});

router.get("/find/all", async (req, res) => {
  const db = await getDatabase();
  const users = await db.all(`
    SELECT
      u.*,
      a.avatar_path,
      (SELECT COUNT(*) FROM subscriptions WHERE subscribed_user_id = u.id) AS totl_subscriptions
    FROM
      users AS u
    LEFT JOIN
      avatars AS a
    ON
      u.avatar_id = a.id
    WHERE
      u.username LIKE ? COLLATE NOCASE
    `, `%${req.query.key}%`);
    return res.status(200).json(users);
});
