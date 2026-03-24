import express from "express";
import dotenv from "dotenv";
import { connect } from "./DB.js";
import authorRouter from "./routes/authors.js";
import blogPostRouter from "./routes/blogPosts.js";

dotenv.config();
connect();
const app = express();
app.use(express.json());
app.get("/", (req, res) => {
  res.status(200).json({ message: "Ciao Mondo" });
});
app.use("/authors", authorRouter);
app.use("/blogPosts", blogPostRouter);
app.listen(process.env.PORT, () => {
  console.log("il server è attivo");
});
