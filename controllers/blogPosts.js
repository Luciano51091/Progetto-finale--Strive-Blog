import mongoose from "mongoose";
import BlogPost from "../models/BlogPost.js";

// 1. LISTA DEI POST
export async function findAll(req, res) {
  try {
    const { page, limit } = req.query;
    const blogPostsQuery = BlogPost.find();
    if (page && limit) {
      blogPostsQuery.skip((page - 1) * limit).limit(limit);
    }
    const blogPosts = await blogPostsQuery;
    res.status(200).json(blogPosts);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}

// 2. SINGOLO POST (id)

export async function findById(req, res) {
  try {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: "Invalid Blog Post Id" });
    }
    const blogPost = await BlogPost.findById(id);
    if (!blogPost) {
      return res.status(404).json({ message: "Blog Post Not Found" });
    }
    return res.status(200).json(blogPost);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}

// 3. CREAZIONE DI NUOVO POST

export async function create(req, res) {
  try {
    const postData = req.body;
    if (req.file) {
      postData.cover = req.file.path;
    }
    const blogPost = new BlogPost({
      ...postData,
      author: req.authUser.email,
    });
    const newBlogPost = await blogPost.save();
    res.status(201).json(newBlogPost);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
}

// 4. ELIMINAZIONE DI UN POST

export async function elimina(req, res) {
  try {
    const { id } = req.params;
    // 1. Validazione dell'ID
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: "Invalid Blog Post Id" });
    }
    // 2. Cerchiamo il post
    const blogPost = await BlogPost.findById(id);
    if (!blogPost) {
      return res.status(404).json({ message: " Blog Post Not Found" });
    }

    // 3. CONTROLLO DI SICUREZZA

    if (blogPost.author !== req.authUser.email) {
      return res.status(403).json({
        message: "Forbidden: Non sei autorizzato a eliminare questo post.",
      });
    }

    await BlogPost.findByIdAndDelete(id);

    res.status(200).json({ message: " Blog Post Deleted" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}

// 5. MODIFICA DI UN POST

export async function update(req, res) {
  try {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: "Invalid Blog Post Id" });
    }

    const blogPost = await BlogPost.findById(id);
    if (!blogPost) {
      return res.status(404).json({ message: "Blog Post Not Found" });
    }

    if (blogPost.author !== req.authUser.email) {
      return res.status(403).json({ message: "Non sei autorizzato a modificare questo post" });
    }

    const { category, title, cover, readTime, content } = req.body;
    const updatedBlogPost = await BlogPost.findByIdAndUpdate(id, { category, title, cover, readTime, content }, { new: true });
    if (!updatedBlogPost) {
      return res.status(404).json({ message: " Blog Post Not Found" });
    }

    res.status(200).json(updatedBlogPost);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}

export async function uploadCover(req, res) {
  try {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        message: "Invalid blogPost Id",
      });
    }
    if (!req.file) {
      return res.status(400).json({ message: "Invalid file" });
    }
    const blogPost = await BlogPost.findByIdAndUpdate(id, { cover: req.file.path }, { returnDocument: "after" });

    if (!blogPost) {
      return res.status(404).json({ message: " Blog Post Not Found" });
    }
    res.status(200).json(blogPost);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}
