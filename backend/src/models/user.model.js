import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, "Name is required"],
        trim: true,
        maxlength: [50, "Name cannot exceed 50 characters"]
    },
    email: {
        type: String,
        required: [true, "Email is required"],
        unique: true,
        trim: true,
        lowercase: true,
        match: [/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/, "Please enter a valid email address"],
    },
    password: {
        type: String,
        required: [true, "Password is required"],
        minlength: [8, "Password must be at least 8 characters long"],
        select: false // Hide password by default when fetching user
    },
    bio: {
        type: String,
        trim: true,
        maxlength: 200
    },
    socials: {
        linkedin: {
            type: String,
            match: [
                /^https?:\/\/(www\.)?linkedin\.com\/.+$/,
                "Invalid LinkedIn profile URL",
            ],
        },
        instagram: {
            type: String,
            match: [
                /^https?:\/\/(www\.)?instagram\.com\/[A-Za-z0-9_.]+$/,
                "Invalid Instagram profile URL",
            ],
        },
        x: {
            type: String,
            match: [
                /^https?:\/\/(twitter\.com|x\.com)\/[A-Za-z0-9_]+$/,
                "Invalid X/Twitter profile URL",
            ],
        },
    },
    lastLogin: {
        type: Date,
        default: null
    }
},
    {
        timestamps: true, toJSON: { virtuals: true }, toObject: { virtuals: true }
    }
);


// Virtual: Blogs authored by the user
userSchema.virtual("blogs", {
    ref: "Blog",
    localField: "_id",
    foreignField: "author",
});

// Virtual: Blog count
userSchema.virtual("blogCount", {
    ref: "Blog",
    localField: "_id",
    foreignField: "author",
    count: true,
});

// Virtual: Number of blogs the user has liked
userSchema.virtual("likedBlogs", {
    ref: "Blog",
    localField: "_id",
    foreignField: "likes", // because Blog.likes stores userIds
    count: true,
});

// Virtual: Total likes received on the user’s blogs
userSchema.virtual("totalLikesReceived", {
    ref: "Blog",
    localField: "_id",
    foreignField: "author",
    justOne: false,
    options: {}, // placeholder (we’ll aggregate in controller)
});

// Virtual: Total comments received on the user’s blogs
userSchema.virtual("totalCommentsReceived", {
    ref: "Blog",
    localField: "_id",
    foreignField: "author",
    justOne: false,
    options: {}, // placeholder (we’ll aggregate in controller)
});


// Create text index for search functionality
userSchema.index({ name: 'text', email: 'text', bio: "text" });

const User = mongoose.model('User', userSchema);
export default User;