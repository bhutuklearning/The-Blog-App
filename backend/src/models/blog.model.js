import mongoose from "mongoose";

const blogSchema = new mongoose.Schema({
    title: {
        type: String,
        required: [true, "Title is required"],
        trim: true,
        maxlength: [150, "Title cannot exceed 150 characters"]
    },
    content: {
        type: String,
        required: [true, "Content is required"],
    },
    author: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User", // connects with User.blogs virtual
        required: true,
    },
    likes: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User", // connects with User.likedBlogs virtual
        },
    ],
    dislikes: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
        },
    ],
    comments: [
        {
            user: {
                type: mongoose.Schema.Types.ObjectId,
                ref: "User", // will populate user name/email in comments
                required: true,
            },
            text: {
                type: String,
                required: true,
                trim: true,
                maxlength: 300,
            },
            createdAt: {
                type: Date,
                default: Date.now(),
            },
        },
    ],
}, {
    timestamps: true, toJSON: { virtuals: true }, toObject: { virtuals: true },
});

//  Virtuals for counts
blogSchema.virtual("likeCount").get(function () {
    return this.likes?.length || 0;
});

blogSchema.virtual("dislikeCount").get(function () {
    return this.dislikes?.length || 0;
});

blogSchema.virtual("commentCount").get(function () {
    return this.comments?.length || 0;
});

// Full-text index for searching blogs
blogSchema.index({ title: "text", content: "text" });



const Blog = mongoose.model("Blog", blogSchema);
export default Blog;