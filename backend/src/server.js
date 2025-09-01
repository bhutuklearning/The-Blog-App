import express from 'express';
import cookieParser from 'cookie-parser';
import dotenv from 'dotenv';
dotenv.config();

import connectDB from './config/db.js';
import authRoutes from './routes/auth.route.js';
import userRoutes from './routes/user.route.js';
import blogRoutes from './routes/blog.route.js';


const app = express();

const PORT = process.env.PORT || 10000;

// Middleware to parse JSON bodies
app.use(express.json());

//connectDB();

// Routing
app.use("/api/v1/auth", authRoutes);
app.use("/api/v1/users", userRoutes);
app.use("/api/v1/blogs", blogRoutes);


app.get("/", (req, res, next) => {
    res.status(200).json({
        message: "Welcome to the Home Page of the Blog App."
    });
});

app.listen(PORT, (req, res, next) => {
    console.log(`Server is running on PORT ${PORT}.`);
});