import express from 'express';
import { protect } from '../middleware/authMiddleware.js';
import {
    getAllBlogs, getBlogById, getMyBlogs, createBlog, updateBlog, deleteBlog,
    likeBlog, dislikeBlog, addComment
} from '../controller/blog.controller.js';

const router = express.Router();

router.get("/", (req, res) => {
    res.send("Welcome to the Blog route of The Blog App.");
});

// Public routes
router.get("/", getAllBlogs);
router.get("/:id", getBlogById);

// Protected routes
router.get("/my/blogs", protect, getMyBlogs);
router.post("/", protect, createBlog);
router.put("/:id", protect, updateBlog);
router.delete("/:id", protect, deleteBlog);

// Like a blog
router.put("/:id/like", protect, likeBlog);

// Dislike a blog
router.put("/:id/dislike", protect, dislikeBlog);

// Comment on a blog
router.post("/:id/comment", protect, addComment);

export default router;
