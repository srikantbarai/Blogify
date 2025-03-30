require("dotenv").config();

const path = require("path");
const express = require("express");
const mongoose = require("mongoose");
const cookieParser = require("cookie-parser")
const userRoute = require("./routes/user");
const blogRoute = require("./routes/blog");

const { checkForAuthenticationCookie } = require("./middlewares/authentication");

const Blog = require("./models/blog");
const User = require("./models/user");

const app = express();
const PORT = process.env.PORT;

mongoose.connect(process.env.MONGO_URL).then(() => console.log("MongoDB Connected")).catch(err => console.log("Mongo error",err));

app.set('view engine','ejs');
app.set('views',path.resolve("./views"));

app.use(express.urlencoded({extended: false}));
app.use(cookieParser());
app.use(checkForAuthenticationCookie("token"));
app.use(express.static(path.resolve("./public")));

app.get("/", async (req,res) => {
    const allBlogs = await Blog.find({}).sort("-createdAt");
    let fullName = null;
    if (req.user) {
        const user = await User.findById(req.user._id);
        if (user) fullName = user.fullName;
    }
    res.render("home",{
        user : req.user,
        blogs: allBlogs,
        fullName
    });
});
app.use("/user",userRoute);
app.use("/blog",blogRoute);

app.listen(PORT, ()=> console.log(`Server started at PORT ${PORT}`));