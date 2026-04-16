import mongoose from "mongoose";
import BlogPost from "../models/BlogPost.js";

// 1. LISTA DEI POST
export async function findAll(req, res) {
  try {
    const page = parseInt(req.query.page, 10) || 1;
    const limit = parseInt(req.query.limit, 10) || 6;
    const { title } = req.query;

    const skip = (page - 1) * limit;

    const filter = title ? { title: { $regex: title, $options: "i" } } : {};

    const total = await BlogPost.countDocuments(filter);

    const blogPosts = await BlogPost.find(filter).sort({ _id: -1 }).skip(skip).limit(limit);

    res.status(200).json({
      posts: blogPosts,
      currentPage: page,
      totalPages: Math.ceil(total / limit),
      totalPosts: total,
    });
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

// 6. MODIFICA IMMAGINE POST
export async function uploadCover(req, res) {
  try {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: "Invalid blogPost Id" });
    }
    if (!req.file) {
      return res.status(400).json({ message: "Invalid file" });
    }

    const blogPost = await BlogPost.findById(id);
    if (!blogPost) {
      return res.status(404).json({ message: "Blog Post Not Found" });
    }

    if (blogPost.author !== req.authUser.email) {
      return res.status(403).json({ message: "Non sei autorizzato a cambiare la cover di questo post" });
    }

    blogPost.cover = req.file.path;
    const updatedPost = await blogPost.save();

    res.status(200).json(updatedPost);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}

// AGGIUNTA DEI COMMENTI AL POST

export async function addComment(req, res) {
  try {
    const { id } = req.params;
    const { text } = req.body;

    const updatedBlogPost = await BlogPost.findByIdAndUpdate(
      id,
      {
        $push: {
          comments: {
            text,
            author: req.authUser.email,
          },
        },
      },
      { new: true, runValidators: true },
    );

    if (!updatedBlogPost) {
      return res.status(404).json({ message: "Blog Post Not Found" });
    }

    res.status(201).json(updatedBlogPost.comments);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
}

// MODIFICA DEI COMMENTI DA PARTE DELL'UTENTE LOGGATO

export async function updateComment(req, res) {
  try {
    const { postId, commentId } = req.params;
    const { text } = req.body;

    const post = await BlogPost.findById(postId);
    if (!post) return res.status(404).json({ message: "Post non trovato" });

    const comment = post.comments.id(commentId);
    if (!comment) return res.status(404).json({ message: "Commento non trovato" });

    if (comment.author !== req.authUser.email) {
      return res.status(403).json({ message: "Non autorizzato" });
    }

    comment.text = text;
    await post.save();

    res.json(post.comments);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}

//CANCELLAZIONE COMMENTO DA PARTE DELL'UTENTE LOGGATO
export async function deleteComment(req, res) {
  try {
    const { postId, commentId } = req.params;

    const post = await BlogPost.findById(postId);
    if (!post) return res.status(404).json({ message: "Post non trovato" });

    const comment = post.comments.id(commentId);
    if (!comment) return res.status(404).json({ message: "Commento non trovato" });

    if (comment.author !== req.authUser.email) {
      return res.status(403).json({ message: "Non autorizzato a eliminare questo commento" });
    }

    comment.deleteOne();
    await post.save();

    res.status(200).json(post.comments);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}

export async function findMyPosts(req, res) {
  try {
    const myPosts = await BlogPost.find({ author: req.authUser.email });
    res.status(200).json(myPosts);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}
