import { getDatabase } from "../data/database.js";
import { getUsernameFromToken } from "../data/util.js";

export async function requiresAuthentication(req, res, next) {
  let username;
  if (req.cookies.authToken == null) {
    return res.sendStatus(401);
  }
  try {
    username = getUsernameFromToken(req.cookies.authToken);
  } catch {
    return res.sendStatus(401);
  }
  const db = await getDatabase();
  const user = await db.get("SELECT * FROM users WHERE username = ?", username);
  if (!user) {
    return res.sendStatus(401);
  }
  req.user = user;
  next();
}
