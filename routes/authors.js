import express from "express";
import { create, elimina, findAll, findById, update } from "../controllers/authors.js";

const authorRouter = express.Router();
authorRouter.get("/", findAll);
authorRouter.get("/:id", findById);
authorRouter.post("/", create);
authorRouter.delete("/:id", elimina);
authorRouter.put("/:id", update);

export default authorRouter;
