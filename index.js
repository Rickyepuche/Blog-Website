//https://rickyepucheblog.my.canva.site/
import express from "express";
import bodyParser from "body-parser";
import multer from "multer";
import { name } from "ejs";

const app = express();
const storage = multer.diskStorage({
    destination: function (req, file, cb){
        cb(null, "public/uploads");
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + "-" + file.originalname);
    }
});
const port = 3000;

const upload = multer({storage: storage});

app.use(express.static("public"));
app.use(bodyParser.urlencoded({ extended: true }));

let blogPosts = [];


app.get("/", (req, res) => {

    res.render("index.ejs", {blogItems: blogPosts})
});

app.get("/blog/:id", (req, res) => {
    let id = parseInt(req.params.id);
    let selected = blogPosts[id];
    if (!selected) {
        return res.send("Topic not found");
    }

    res.render("blog.ejs", {
        topic: selected.topic,
        description: selected.description,
        text: selected.text,
        image: selected.image
    });
});

app.get("/about", (req, res) => {
    res.render("about.ejs")
});

app.get("/contact", (req, res) => {
    res.render("contact.ejs")
});

app.get("/blogForm", (req, res) => {
    res.render("blogForm.ejs")
});
//

app.post("/add", upload.single("image"), (req, res)=>{
    let text = req.body.text;
    let description = req.body.description;
    let topic = req.body.topic;

    let imagePath = "/uploads/default.jpg";
    
    if (req.file) {
        imagePath = "/uploads/" + req.file.filename;
    }

    if (description.length > 149) {
        description = description.substring(0, 149); // trim it
    }
    if (topic.length > 34) {
        topic = topic.substring(0, 35); // trim it
    }

    blogPosts.push({
        topic: topic,
        description: description,
        text: text,
        image: imagePath
    });

    res.redirect("/");
});

app.listen(port, () => {
  console.log(`Listening on port ${port}`);
});