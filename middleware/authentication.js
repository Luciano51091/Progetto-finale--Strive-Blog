import jwt from "jsonwebtoken";
import Author from "../models/Author.js";

export function authentication(req, res, next) {
  const token = req.headers.authorization;
  if (!token) return res.status(401).send();
  const parts = token.split(" ");
  const jwtToken = parts.length === 2 ? parts[1] : parts[0];
  jwt.verify(jwtToken, process.env.JWT_SECRET, async (error, payload) => {
    if (error) return res.status(401).send();
    const author = await Author.findById(payload.id);
    if (!author) return res.status(401).send();
    req.authUser = author;
    next();
  });
}
