import bcrypt from "bcrypt";
import express from "express";
import { getDatabase } from "../data/database.js";
import yup from "yup";
import { createUserSchema, encryptPassword } from "../data/util.js"

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
      return res.status(400).json({errors: error.errors});
    } else {
      return res.sendStatus(500);
    }
  }
});