import mongoose from "mongoose";
import Author from "../models/Author.js";
import BlogPost from "../models/BlogPost.js";
import { sendEmail } from "../utils/mail.js";

export async function findAll(req, res) {
  try {
    const { page, limit } = req.query;
    const authorsQuery = Author.find(); //{ avatar: { $eq: "Lost" } }); se voglio filtrare nel database
    if (page && limit) {
      authorsQuery.skip((page - 1) * limit).limit(limit);
    }
    const authors = await authorsQuery;
    res.status(200).json(authors);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}
export async function findById(req, res) {
  try {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        message: "Invalid Author Id",
      });
    }
    const author = await Author.findById(id);
    if (!author) {
      return res.status(404).json({
        message: "Author Not Found",
      });
    }
    res.status(200).json(author);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}

export async function create(req, res) {
  try {
    const { name, surname, email, birthDate, password } = req.body;

    const existingAuthor = await Author.findOne({ email });
    if (existingAuthor) {
      return res.status(400).json({ message: "L'email è già registrata" });
    }

    let avatarUrl = "";
    if (req.file) {
      avatarUrl = req.file.path;
    }

    const author = new Author({
      name,
      surname,
      email,
      birthDate,
      password,
      avatar: avatarUrl,
    });

    const newAuthor = await author.save();

    try {
      await sendEmail(
        newAuthor.email,
        "Benvenuto su Strive Blog!",
        `Ciao ${newAuthor.name}, grazie per esserti registrato!`,
        `<h1>Benvenuto ${newAuthor.name}!</h1><p>Siamo felici di averti nella nostra community di autori.</p>`,
      );
      console.log("Email di benvenuto inviata correttamente a:", newAuthor.email);
    } catch (mailError) {
      console.error("Errore nell'invio della mail di benvenuto:", mailError);
    }

    const authorObject = newAuthor.toObject();
    delete authorObject.password;

    res.status(201).json(authorObject);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}
export async function elimina(req, res) {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: "Invalid Author Id" });
    }

    if (!req.authUser) {
      return res.status(401).json({ message: "Effettua il login per procedere" });
    }

    if (req.authUser._id.toString() !== id) {
      return res.status(403).json({ message: "Non sei autorizzato a eliminare questo profilo" });
    }

    const authorToDelete = await Author.findById(id);
    if (!authorToDelete) {
      return res.status(404).json({ message: "Autore non trovato." });
    }

    await BlogPost.deleteMany({ author: authorToDelete._id });

    await Author.findByIdAndDelete(id);

    res.status(200).json({ message: "Account e tutti i post associati eliminati con successo." });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}

export async function update(req, res) {
  try {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        message: "Invalid Author Id",
      });
    }
    const { name, surname, email, birthDate, avatar } = req.body;
    const updateAuthor = await Author.findByIdAndUpdate(
      id,
      { name, surname, email, birthDate, avatar },
      {
        returnDocument: "after",
      },
    );
    if (!updateAuthor) {
      return res.status(404).json({
        message: "Author Not Found",
      });
    }
    res.status(200).json(updateAuthor);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}

export async function uploadAvatar(req, res) {
  try {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        message: "Invalid Author Id",
      });
    }
    if (!req.file) {
      return res.status(400).json({ message: "Invalid file" });
    }
    const author = await Author.findByIdAndUpdate(id, { avatar: req.file.path }, { returnDocument: "after" });

    if (!author) {
      return res.status(404).json({
        message: "Author Not Found",
      });
    }
    res.status(200).json(author);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}
