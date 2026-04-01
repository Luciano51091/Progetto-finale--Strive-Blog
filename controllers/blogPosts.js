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
    const { category, title, cover, readTime, author, content } = req.body;
    const blogPost = new BlogPost({
      category,
      title,
      cover,
      readTime,
      author,
      content,
    });
    const newBlogPost = await blogPost.save();
    res.status(201).json(newBlogPost);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}

// 4. ELIMINAZIONE DI UN POST

export async function elimina(req, res) {
  try {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: "Invalid Blog Post Id" });
    }
    const deletedBlogPost = await BlogPost.findByIdAndDelete(id);
    if (!deletedBlogPost) {
      return res.status(404).json({ message: " Blog Post Not Found" });
    }
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
    const { category, title, cover, readTime, author, content } = req.body;
    const updateBlogPost = await BlogPost.findByIdAndUpdate(
      id,
      { category, title, cover, readTime, author, content },
      {
        returnDocument: "after",
      },
    );
    if (!updateBlogPost) {
      return res.status(404).json({ message: " Blog Post Not Found" });
    }
    res.status(200).json(updateBlogPost);
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
