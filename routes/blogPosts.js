import express from "express";
import { findAll, findById, create, elimina, update, uploadCover } from "../controllers/blogPosts.js";
import parser from "../middleware/cloudinary.js";

const blogPostRouter = express.Router();
blogPostRouter.get("/", findAll);
blogPostRouter.get("/:id", findById);
blogPostRouter.post("/", create);
blogPostRouter.delete("/:id", elimina);
blogPostRouter.put("/:id", update);
blogPostRouter.patch("/:id/cover", parser.single("cover"), uploadCover);

export default blogPostRouter;
