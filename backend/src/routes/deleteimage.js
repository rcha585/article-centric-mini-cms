import fs from "fs";
import path from "path";

const PLACEHOLDER_IMAGE = "images/placeholder.png";
export function deleteImageIfNotDefault(imgPath) {
  if (
    !imgPath ||
    imgPath === PLACEHOLDER_IMAGE ||
    imgPath.endsWith("/default-image.jpg")
  ) {
    return;
  }
  const realPath = path.join(process.cwd(), "public", imgPath);
  fs.unlink(realPath, (err) => {
    if (err) console.log("Picture delete failed, maybe delete already.", realPath, err.message);
  });
}
