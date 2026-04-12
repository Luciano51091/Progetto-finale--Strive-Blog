import mongoose from "mongoose";
import Author from "../models/Author.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

export async function login(req, res) {
  try {
    const { email, password } = req.body;

    let author = await Author.findOne({ email: email });
    if (!author) {
      return res.status(401).json({ message: "Credenziali errate" });
    }

    const result = await bcrypt.compare(password, author.password);
    if (!result) {
      return res.status(401).json({ message: "Credenziali errate" });
    }
    jwt.sign(
      {
        id: author.id,
      },
      process.env.JWT_SECRET,
      {
        expiresIn: "1h",
      },
      function (error, jwtToken) {
        if (error) {
          res.status(500).json({ message: error.message });
        } else {
          res.json({
            token: jwtToken,
          });
        }
      },
    );
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}

export const getMe = async (req, res) => {
  try {
    res.json(req.authUser);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
