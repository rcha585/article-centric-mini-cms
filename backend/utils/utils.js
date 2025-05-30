import bcrypt from "bcrypt";
import yup from "yup";

async function encryptPassword(password) {
    const encryptedPassword = await bcrypt.hash(password, 10);
    return encryptedPassword;
}

async function checkPassword(password, encryptedPassword) {
    const isMatch = await bcrypt.compare(password, encryptedPassword);
    return isMatch;
}

const createUserSchema = yup.object({
  username: yup.string().max(100).required(),
  password: yup.string().max(100).required(),
  first_name: yup.string().max(100).required(),
  last_name: yup.string().max(100).required(),
  date_of_birth: yup.string().matches("/^\d{4}-\d{2}-\d{2} \d{2}:\d{2}:\d{2}$/"),
  description: yup.string().max(255).required(),
  avatar_patt: yup.string().max(255).required()
}).required();