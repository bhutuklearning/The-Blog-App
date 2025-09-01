// import User from "../models/user.model.js";
// import bcrypt from "bcryptjs";
// import generateToken from "../utils/generateToken.js";

// export const register = async (req, res) => {
//     // res.send("User registration controller is working");
//     try {
//         const { name, email, password } = req.body;

//         // Checking if all the fields are provided or not
//         if (!name || !email || !password) {
//             return res.status(400).json({ message: "Please provide name, email and password" });
//         }

//         // Check if user already exists
//         const existingUser = await User.findOne({ email });
//         if (existingUser) {
//             return res.status(400).json({ message: "User with this email already exists" });
//         }

//         // Hash the password
//         const salt = await bcrypt.genSalt(10);
//         const hashedPassword = await bcrypt.hash(password, salt);

//         // Create user
//         const user = await User.create({
//             name,
//             email,
//             password: hashedPassword,
//         });

//         user.save();

//         if (user) {
//             generateToken(res, user._id); // generate token and sets cookie as well
//             res.status(201).json({
//                 success: true,
//                 message: "User registered successfully",
//                 _id: user._id,
//                 name: user.name,
//                 email: user.email,
//                 user
//             });
//         }
//         else {
//             return res.status(400).json({ success: false, message: "Invalid user data and please try again" });
//         }
//     } catch (error) {
//         console.error("Error in user registration:", error);
//         res.status(500).json({ message: "Error during registration", error: error.message });
//     }
// }

// export const login = async (req, res) => {
//     // res.send("User login controller is working");
//     try {
//         const { email, password } = req.body;

//         // Check if all fields are provided
//         if (!email || !password) {
//             return res.status(400).json({ message: "Please provide email and password" });
//         }

//         // Check if the user exists
//         const user = await User.findOne({ email }).select("+password");

//         if (!user) {
//             return res.status(400).json({ message: "User with this email does not exist or register first." });
//         }

//         // Compare the provided password with the hashed password in the database
//         const isPasswordValid = await bcrypt.compare(password, user.password);
//         if (!isPasswordValid) {
//             return res.status(401).json({ message: "Invalid password" });
//         }

//         if (user && isPasswordValid) {
//             generateToken(res, user._id); // sets cookie

//             user.lastLogin = new Date().toString();
//             await user.save();

//             res.status(200).json({
//                 success: true,
//                 message: "User logged in successfully",
//                 _id: user._id,
//                 name: user.name,
//                 email: user.email,
//                 lastLogin: user.lastLogin,
//             });
//         }
//         else {
//             return res.status(400).json({ success: false, message: "Invalid user data or please try again" });
//         }
//     }
//     catch (error) {
//         console.error("Error in user login:", error);
//         res.status(500).json({ message: "Error during login", error: error.message });
//     }
// }


// export const logout = async (req, res) => {
//     // res.send("User logout controller is working");
//     try {
//         res.cookie("token", "", {
//             httpOnly: true,
//             expires: new Date(0) // Set the cookie to expire immediately
//         });
//         res.status(200).json({ message: "User logged out successfully" });
//     }
//     catch (error) {
//         console.error("Error in user logout:", error);
//         res.status(500).json({ message: "Error during logout", error: error.message });
//     }
// }








import User from "../models/user.model.js";
import bcrypt from "bcryptjs";
import generateToken from "../utils/generateToken.js";

// Register
export const register = async (req, res) => {
    try {
        const { name, email, password } = req.body;
        if (!name || !email || !password) {
            return res.status(400).json({ message: "Please provide name, email and password" });
        }
        const existingUser = await User.findOne({ email });
        if (existingUser) return res.status(400).json({ message: "User with this email already exists" });

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);
        const user = await User.create({ name, email, password: hashedPassword });

        // Optionally update lastLogin on register (comment out if you prefer null)
        user.lastLogin = new Date();
        await user.save();

        generateToken(res, user._id); // sets cookie 'jwt'

        res.status(201).json({
            success: true,
            message: "User registered successfully",
            _id: user._id,
            name: user.name,
            email: user.email,
        });
    } catch (error) {
        console.error("Error in user registration:", error);
        res.status(500).json({ message: "Error during registration", error: error.message });
    }
};

// Login
export const login = async (req, res) => {
    try {
        const { email, password } = req.body;
        if (!email || !password) return res.status(400).json({ message: "Please provide email and password" });

        // include password explicitly because schema has select: false
        const user = await User.findOne({ email }).select("+password");
        if (!user) return res.status(400).json({ message: "User not found. Please register." });

        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) return res.status(401).json({ message: "Invalid password" });

        generateToken(res, user._id); // sets cookie 'jwt'

        // update lastLogin
        user.lastLogin = new Date();
        await user.save();

        // return profile without password
        const safeUser = await User.findById(user._id).select("-password");
        res.status(200).json({
            success: true,
            message: "User logged in successfully",
            user: safeUser,
        });
    } catch (error) {
        console.error("Error in user login:", error);
        res.status(500).json({ message: "Error during login", error: error.message });
    }
};

// Logout
export const logout = async (req, res) => {
    try {
        // clear the same cookie name: 'jwt'
        res.cookie("jwt", "", {
            httpOnly: true,
            expires: new Date(0),
        });
        res.status(200).json({ message: "User logged out successfully" });
    } catch (error) {
        console.error("Error in user logout:", error);
        res.status(500).json({ message: "Error during logout", error: error.message });
    }
};
