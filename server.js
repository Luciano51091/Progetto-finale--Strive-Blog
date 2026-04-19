import express from "express";
import dotenv from "dotenv";
import { connect } from "./DB.js";
import authorRouter from "./routes/authors.js";
import blogPostRouter from "./routes/blogPosts.js";
import cors from "cors";
import commentsRouter from "./routes/comments.js";
import authRouter from "./routes/auth.js";
import passport from "passport";
import "./config/passport.js";

dotenv.config();
connect();
const app = express();
app.use(cors());
app.use(express.json());
app.use(passport.initialize());

app.get("/", (req, res) => {
  res.status(200).json({ message: "Ciao Mondo" });
});
app.use("/auth", authRouter);
app.use("/authors", authorRouter);
app.use("/blogPosts", blogPostRouter);
app.use("/", commentsRouter);

const PORT = process.env.PORT || 3001;

app.listen(PORT, () => {
  console.log(`Server attivo sulla porta: ${PORT}`);
  console.table({
    "Endpoint principale": `http://localhost:${PORT}`,
    Status: "Running",
  });
});
