import express from "express";
import { getDatabase } from "../data/database.js";
import { requiresAuthentication } from "../middleware/authentication.js";
import yup from "yup";

const router = express.Router();
export default router;

const createTagSchema = yup.object({
    content: yup.string().max(100).required(),
}).required();

router.post("/", async (req, res) => {
  try {
    const {content} = req.body;
    const validatedInput = createTagSchema.validateSync({content}, {abortEarly: false, stripUnknown: true});
    const db = await getDatabase();
    await db.run("INSERT INTO tags (content) VALUES(?)",validatedInput.content);
    return res.sendStatus(200);
  } catch (error) {
    if (error.name == "ValidationError") {
        return res.status(400).json({errors: error.errors});
    }
    if (error.code == "SQLITE_CONSTRAINT") {
      return res.sendStatus(409);
    }
    return res.sendStatus(500);
  }
});

router.get("/", async (req, res) => {
    const db = await getDatabase();
    const tags = await db.all("SELECT * FROM tags");
    return res.status(200).json(tags);
});

router.get("/:tid/articles", async (req, res) => {
    const db = await getDatabase();
    const articles = await db.all("SELECT a.id AS article_id, a.title AS article_title, a.content AS article_content, a.created_at AS article_created_at, a.image_path, u.username FROM taggings AS t INNER JOIN articles AS a ON t.article_id = a.id INNER JOIN users AS u ON a.author_id = u.id WHERE t.tag_id = ?", req.params.tid);
    return res.status(200).json(articles);
});