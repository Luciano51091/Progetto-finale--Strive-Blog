import express from "express";
import { create, elimina, findAll, findById, update, uploadAvatar } from "../controllers/authors.js";
import parser from "../middleware/cloudinary.js";

const authorRouter = express.Router();
authorRouter.get("/", findAll);
authorRouter.get("/:id", findById);
authorRouter.post("/", create);
authorRouter.delete("/:id", elimina);
authorRouter.put("/:id", update);
authorRouter.patch("/:id/avatar", parser.single("avatar"), uploadAvatar);

export default authorRouter;
