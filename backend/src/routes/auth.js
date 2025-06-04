import bcrypt from "bcrypt";
import express from "express";
import { getDatabase } from "../data/database.js";
import jsonwebtoken from "jsonwebtoken";
import { requiresAuthentication } from "../middleware/authentication.js";

const router = express.Router();
export default router;

async function checkPassword(password, encryptedPassword) {
  const isMatch = await bcrypt.compare(password, encryptedPassword);
  return isMatch;
}

function getTokenFromUsername(username) {
  const token = jsonwebtoken.sign({ username }, process.env.TOKEN_SECRET_KEY);
  return token;
}

router.post("/login", async (req, res) => {
  const username = req.body.username;
  const password = req.body.password;
  const db = await getDatabase();
  const user = await db.get("SELECT * FROM users WHERE username = ?", username);
  if (!user) {
    return res.status(400).send("no user found");
  }
  const isMatch = await checkPassword(password, user.password);
  if (!isMatch) {
    return res.status(400).send("wrong password");
  }
  let authToken = getTokenFromUsername(username);
  return res
    .cookie("authToken", authToken, {
      expires: new Date(Date.now() + 24 * 60 * 60 * 1000),
      path: "/",
      httpOnly: true
    })
    .sendStatus(200);
});

router.post("/logout", (req, res) => {
  return res.cookie("authToken", "", { expires: new Date(0), httpOnly: true }).sendStatus(204);
});

router.get("/me", requiresAuthentication, async (req, res) => {
  const { password, ...user } = req.user;
  return res.status(200).json(user);
});
