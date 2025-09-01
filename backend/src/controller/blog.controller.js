import e from "express";
import Blog from "../models/blog.model.js";
import sanitizeHtml from "sanitize-html";


// Public Endpoint - Get all blogs
export const getAllBlogs = async (req, res) => {
    try {
        const { search } = req.query;
        let blogs, formattedBlogs;

        if (search) {
            blogs = await Blog.find({ $text: { $search: search } })
                .populate("author", "name email")
                .sort({ createdAt: -1 });

            formattedBlogs = blogs.map((blog) => ({
                ...blog.toObject(),
                likesCount: blog.likes.length,
                dislikesCount: blog.dislikes.length,
                commentsCount: blog.comments.length,
            }));

        } else {
            // blogs = await Blog.find()
            //     .populate("author", "name email")
            //     .sort({ createdAt: -1 });
            blogs = await Blog.find()
                .populate("author", "name email")
                .populate("comments.user", "name")
                .sort({ createdAt: -1 });

            formattedBlogs = blogs.map((blog) => ({
                ...blog.toObject(),
                likesCount: blog.likes.length,
                dislikesCount: blog.dislikes.length,
                commentsCount: blog.comments.length,
            }));
        }

        res.json(formattedBlogs);
    }
    catch (error) {
        console.error("Get All Blogs Error:", error);
        res.status(500).json({ message: "Server error", error: error.message });
    }
}

// Public Endpoint - Get Blog by ID
export const getBlogById = async (req, res) => {
    try {
        const blog = await Blog.findById(req.params.id).populate("author", "name email");

        if (!blog) {
            return res.status(404).json({ message: "Blog not found" });
        }

        const formattedBlogs = blog.map((blog) => ({
            ...blog.toObject(),
            likesCount: blog.likes.length,
            dislikesCount: blog.dislikes.length,
            commentsCount: blog.comments.length,
        }));
        res.json(formattedBlogs);
    }
    catch (error) {
        console.error("Get Blog By ID Error:", error);
        res.status(500).json({ message: "Server error", error: error.message });
    }
}

// Protected Endpoint - Get blogs of logged in user
export const getMyBlogs = async (req, res) => {
    try {
        const blogs = await Blog.find({ author: req.user._id }).sort({ createdAt: -1 });

        if (!blogs || blogs.length === 0) {
            res.json({ message: "No blogs found for this user." });
        }

        res.json(blogs);
    } catch (error) {
        console.error("Error fetching user blogs:", error);
        res.status(500).json({ message: "Failed to fetch user blogs", error: error.message });
    }
};

// Protected Endpoint - Create a new blog
export const createBlog = async (req, res) => {
    try {
        const { title, content } = req.body;

        if (!title || !content) {
            return res.status(400).json({ message: "Title and content both are required" });
        }

        const sanitizedContent = sanitizeHtml(content, {
            allowedTags: sanitizeHtml.defaults.allowedTags.concat(["img", "h1", "h2", "u", "iframe"]),
            allowedAttributes: {
                ...sanitizeHtml.defaults.allowedAttributes,
                img: ["src", "alt", "title", "width", "height"],
                iframe: ["src", "width", "height", "frameborder", "allow", "allowfullscreen"],
            },
        });

        const blog = await Blog.create({
            title,
            content: sanitizedContent,
            author: req.user._id,
        });

        blog.save();

        res.status(201).json(blog);
    } catch (err) {
        console.error("Create Blog Error:", err);
        res.status(500).json({ message: "Server error", error: err.message });
    }
};


// Protected Endpoint - Update a blog
export const updateBlog = async (req, res) => {
    try {
        const blog = await Blog.findById(req.params.id);
        if (!blog) {
            return res.status(404).json({ message: "Blog not found" });
        }

        if (blog.author.toString() !== req.user._id.toString()) {
            return res.status(403).json({ message: "Not authorized to update this blog" });
        }

        const { title, content } = req.body;

        if (title) {
            blog.title = title;
        }
        if (content) {
            blog.content = sanitizeHtml(content, {
                allowedTags: sanitizeHtml.defaults.allowedTags.concat(["img", "h1", "h2", "u", "iframe"]),
                allowedAttributes: {
                    ...sanitizeHtml.defaults.allowedAttributes,
                    img: ["src", "alt", "title", "width", "height"],
                    iframe: ["src", "width", "height", "frameborder", "allow", "allowfullscreen"],
                },
            });
        }

        const updatedBlog = await blog.save();
        res.json(updatedBlog);
    } catch (err) {
        console.error("Update Blog Error:", err);
        res.status(500).json({ message: "Server error", error: err.message });
    }
};

// Protected Endpoint - Delete a blog
export const deleteBlog = async (req, res) => {
    try {
        const blog = await Blog.findById(req.params.id);
        if (!blog) return res.status(404).json({ message: "Blog not found" });

        if (blog.author.toString() !== req.user._id.toString()) {
            return res.status(403).json({ message: "Not authorized to delete this blog" });
        }

        await blog.deleteOne();
        res.json({ message: "Blog deleted successfully" });
    } catch (err) {
        console.error("Error deleting blog:", err);
        res.status(500).json({ message: "Failed to delete blog" });
    }
};

// Protected Endpoint - Like a blog
export const likeBlog = async (req, res) => {
    try {
        const blog = await Blog.findById(req.params.id);

        if (!blog) return res.status(404).json({ message: "Blog not found" });

        // Remove user from dislikes if present
        blog.dislikes = blog.dislikes.filter(
            (userId) => userId.toString() !== req.user._id.toString()
        );

        // Toggle like
        if (blog.likes.includes(req.user._id)) {
            blog.likes = blog.likes.filter(
                (userId) => userId.toString() !== req.user._id.toString()
            );
        } else {
            blog.likes.push(req.user._id);
        }

        await blog.save();
        res.json({ message: "Blog liked/unliked", likes: blog.likes.length });
    } catch (error) {
        res.status(500).json({ message: "Error liking blog", error });
    }
};


// Protected Endpoint - Dislike a blog
export const dislikeBlog = async (req, res) => {
    try {
        const blog = await Blog.findById(req.params.id);

        if (!blog) return res.status(404).json({ message: "Blog not found" });

        // Remove user from likes if present
        blog.likes = blog.likes.filter(
            (userId) => userId.toString() !== req.user._id.toString()
        );

        // Toggle dislike
        if (blog.dislikes.includes(req.user._id)) {
            blog.dislikes = blog.dislikes.filter(
                (userId) => userId.toString() !== req.user._id.toString()
            );
        } else {
            blog.dislikes.push(req.user._id);
        }

        await blog.save();
        res.json({ message: "Blog disliked/undisliked", dislikes: blog.dislikes.length });
    } catch (error) {
        res.status(500).json({ message: "Error disliking blog", error });
    }
};


// Protected Endpoint - Add a comment to a blog
export const addComment = async (req, res) => {
    try {
        const blog = await Blog.findById(req.params.id);

        if (!blog) return res.status(404).json({ message: "Blog not found" });

        const comment = {
            user: req.user._id,
            text: req.body.text,
        };

        blog.comments.push(comment);
        await blog.save();

        res.json({ message: "Comment added", comments: blog.comments });
    } catch (error) {
        res.status(500).json({ message: "Error adding comment", error });
    }
};
