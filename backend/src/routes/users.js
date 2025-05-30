import bcrypt from "bcrypt";
import express from "express";
import { getDatabase } from "../data/database.js";
import yup from "yup";

async function encryptPassword(password) {
    const encryptedPassword = await bcrypt.hash(password, 10);
    return encryptedPassword;
}

const createUserSchema = yup.object({
  username: yup.string().max(100).required(),
  password: yup.string().max(100).required(),
  first_name: yup.string().max(100).required(),
  last_name: yup.string().max(100).required(),
  date_of_birth: yup.string().matches(/^\d{4}-\d{2}-\d{2} \d{2}:\d{2}:\d{2}$/, "Invalid date format (YYYY-MM-DD HH:mm:ss)"),
  description: yup.string().max(255).required(),
  avatar_path: yup.string().max(255).required()
}).required();

const router = express.Router();

export default router;

router.post("/", async (req, res) => {
  try {
    const {username, password, first_name, last_name, date_of_birth, description, avatar_path} = req.body;
    const validatedInput = createUserSchema.validateSync({username, password, first_name, last_name, date_of_birth, description, avatar_path}, {abortEarly: false, stripUnknown: true});
    const db = await getDatabase();
    const encryptedPassword = await encryptPassword(password);
    const response = await db.run("INSERT INTO users (username, password, first_name, last_name, date_of_birth, description, avatar_path) VALUES(?, ?, ?, ?, ?, ?, ?)", username, encryptedPassword, first_name, last_name, date_of_birth, description, avatar_path);
    return res.sendStatus(201);
  } catch (error) {
    if (error instanceof yup.ValidationError) {
      return res.send(400).json({errors: error.errors});
    } else {
      return res.sendStatus(500);
    }
  }
});