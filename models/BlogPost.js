import mongoose from "mongoose";

const BlogPostSchema = new mongoose.Schema({
  category: String,
  title: String,
  cover: String,
  readTime: {
    value: Number,
    unit: String,
  },
  author: String,
  content: String,
});

const BlogPost = mongoose.model("Blogpost", BlogPostSchema);

export default BlogPost;
