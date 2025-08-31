import mongoose from "mongoose";

const blogSchema = new mongoose.Schema({}, { timestamps: true });

const Blog = mongoose.model("Blog", blogSchema);
export default Blog;