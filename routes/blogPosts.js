import express from "express";
import { findAll, findById, create, elimina, update, uploadCover } from "../controllers/blogPosts.js";
import parser from "../middleware/cloudinary.js";
import { authentication } from "../middleware/authentication.js";

const blogPostRouter = express.Router();
blogPostRouter.get("/", authentication, findAll);
blogPostRouter.get("/:id", authentication, findById);
blogPostRouter.post("/", authentication, parser.single("cover"), create);
blogPostRouter.delete("/:id", authentication, elimina);
blogPostRouter.put("/:id", authentication, update);
blogPostRouter.patch("/:id/cover", parser.single("cover"), uploadCover);

export default blogPostRouter;
