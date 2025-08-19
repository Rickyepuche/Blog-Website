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
const port = process.env.port || 3000;

const upload = multer({storage: storage});

app.use(express.static("public"));
app.use(bodyParser.urlencoded({ extended: true }));

let blogPosts = [{
    topic: "small daily habits can lead to big lifestyle changes",
    description: "Discover how small daily habits can lead to big lifestyle changes over time. A personal story about discipline, growth, and persistence.",
    text: "When I first decided to change my daily routine, I didn’t think small actions would matter much. I believed success only came from huge breakthroughs. But I quickly learned that tiny, consistent steps are far more powerful.     My journey started with something as simple as drinking more water each morning. It felt insignificant, but over weeks, I noticed I had more energy. That small success gave me motivation to add another habit—reading ten minutes before bed. Soon, I was reading books I had ignored for years.     The beauty of small habits is that they stack. One leads to another, and slowly your life begins to transform without you even realizing it. Looking back after six months, I was healthier, calmer, and more focused than ever before.     The biggest lesson I learned is this: don’t underestimate small beginnings. Great change is rarely sudden—it’s the result of quiet persistence."
}];


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