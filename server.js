import express from "express";
import dotenv from "dotenv";
import { connect } from "./DB.js";
import authorRouter from "./routes/authors.js";
import blogPostRouter from "./routes/blogPosts.js";
import cors from "cors";
import commentsRouter from "./routes/comments.js";

dotenv.config();
connect();
const app = express();
app.use(cors());
app.use(express.json());
app.get("/", (req, res) => {
  res.status(200).json({ message: "Ciao Mondo" });
});
app.use("/authors", authorRouter);
app.use("/blogPosts", blogPostRouter);
app.use("/", commentsRouter);
app.listen(process.env.PORT, () => {
  console.log("il server è attivo");
});
