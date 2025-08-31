import express from "express";


const router = express.Router();

router.get("/", (req, res) => {
    res.send("User route is working");
})

router.post("/register", (req, res) => {
    res.send("User registration route is working");
});

router.post("/login", (req, res) => {
    res.send("User login route is working");
});

router.post("/logout", (req, res) => {
    res.send("User logout route is working");
});

router.get("/profile", (req, res) => {
    res.send("User profile route is working");
});


export default router;
