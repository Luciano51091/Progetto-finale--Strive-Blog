import express from "express";
import { findAll, findById, create, elimina, update } from "../controllers/blogPosts.js";

const blogPostRouter = express.Router();
blogPostRouter.get("/", findAll);
blogPostRouter.get("/:id", findById);
blogPostRouter.post("/", create);
blogPostRouter.delete("/:id", elimina);
blogPostRouter.put("/:id", update);

export default blogPostRouter;
