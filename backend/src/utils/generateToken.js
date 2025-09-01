import jwt from "jsonwebtoken";

const generateToken = (res, userId) => {
    // sign with a consistent claim name `id`
    const token = jwt.sign({ id: userId }, process.env.JWT_SECRET, {
        expiresIn: process.env.JWT_EXPIRES || "7d",
    });

    // set cookie name `jwt`
    const secure = process.env.NODE_ENV === "development";
    res.cookie("jwt", token, {
        httpOnly: true,
        secure,
        sameSite: secure ? "none" : "lax", // if production + cross-site, you may need 'none'
        maxAge: 1000 * 60 * 60 * 24 * 7, // 7 days
    });

    return token;
};

export default generateToken;

