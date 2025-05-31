import bcrypt from "bcrypt";
import jsonwebtoken from "jsonwebtoken";
import yup from "yup";

export async function encryptPassword(password) {
    const encryptedPassword = await bcrypt.hash(password, 10);
    return encryptedPassword;
}

export async function checkPassword(password, encryptedPassword) {
    const isMatch = await bcrypt.compare(password, encryptedPassword);
    return isMatch;
}

export const createUserSchema = yup.object({
  username: yup.string().max(100).required(),
  password: yup.string().max(100).required(),
  first_name: yup.string().max(100).required(),
  last_name: yup.string().max(100).required(),
  date_of_birth: yup.string().matches(/^\d{4}-\d{2}-\d{2} \d{2}:\d{2}:\d{2}$/, "Invalid date format (YYYY-MM-DD HH:mm:ss)").required(),
  description: yup.string().max(255).required(),
  avatar_path: yup.string().max(255).required()
}).required();

export function getTokenFromUsername(username) {
    const token = jsonwebtoken.sign({ username }, process.env.TOKEN_SECRET_KEY);
    return token;
}

export function getUsernameFromToken(token) {
    const payload = jsonwebtoken.verify(token, process.env.TOKEN_SECRET_KEY);
    return payload.username;
}

export const createArticleSchema = yup.object({
    title: yup.string().max(100).required(),
    content: yup.string().required(),
    created_at: yup.string().matches(/^\d{4}-\d{2}-\d{2} \d{2}:\d{2}:\d{2}$/, "Invalid date format (YYYY-MM-DD HH:mm:ss)").required(),
    image_path: yup.string().max(100).required()
}).required();

export const createCommentSchema = yup.object({
    content: yup.string().required(),
    created_at: yup.string().matches(/^\d{4}-\d{2}-\d{2} \d{2}:\d{2}:\d{2}$/, "Invalid date format (YYYY-MM-DD HH:mm:ss)").required(),
    mentioned_users: yup.array().of(yup.number().integer().positive()).required()
}).required();