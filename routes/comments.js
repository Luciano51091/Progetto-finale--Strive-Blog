import express from "express";
import { create, elimina, findAll, findById, update } from "../controllers/comments.js";
import { authentication } from "../middleware/authentication.js";

const commentsRouter = express.Router();
commentsRouter.get("/blogPosts/:blogPostId/comments", findAll);
commentsRouter.get("/blogPosts/:blogPostId/comments/:id", findById);
commentsRouter.post("/blogPosts/:blogPostId/comments", authentication, create);
commentsRouter.delete("/blogPosts/:blogPostId/comments/:id", elimina);
commentsRouter.put("/blogPosts/:blogPostId/comments/:id", update);

export default commentsRouter;
