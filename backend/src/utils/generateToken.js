import jwt from "jsonwebtoken";

const generateToken = (res, userId) => {
    const token = jwt.sign({ userId }, process.env.JWT_SECRET, {
        expiresIn: "7d", // 7 days
    });

    // Store token in HTTP-only cookie
    res.cookie("jwt", token, {
        httpOnly: true, // prevents JavaScript access
        //secure: process.env.NODE_ENV === "production", // use HTTPS in production
        sameSite: "strict", // CSRF protection
        maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    });
};

export default generateToken;
