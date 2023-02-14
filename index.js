const express = require("express");
const app = express();
const dotenv = require("dotenv");
const mongoose = require("mongoose");

// models
const TodoTask = require("./models/TodoTask");


dotenv.config();

app.use("/static", express.static("public"));

app.use(express.urlencoded({ extended: true }));


//connection to db
mongoose.connect(process.env.DB_CONNECT, { useNewUrlParser: true }, () => {
    console.log("Connected to db!");
    app.listen(3000, () => console.log("Server Up and running"));
});



app.set("view engine", "ejs");

// get method concept example
app.get("/", (req, res) => {
    TodoTask.find({}, (err, tasks) => 
    // render template concept example
    {
        res.render("todo.ejs", { todoTasks: tasks });
    });
});

// post method concept example
app.post('/',async (req, res) => {
    const todoTask = new TodoTask({
        content: req.body.content
    });
    try {
        // await concept example
        await todoTask.save();
        res.redirect("/");
    } 
    catch (err) {
        res.redirect("/");
    }
});

// update method
app
// example of route concept
    .route("/edit/:id")
    // get/post request concept example
    .get((req, res) => {
        const id = req.params.id;
        TodoTask.find({}, (err, tasks) => {
            res.render("todoEdit.ejs", { todoTasks: tasks, idTask: id });
        });
    })
    .post((req, res) => {
        const id = req.params.id;
        TodoTask.findByIdAndUpdate(id, { content: req.body.content }, err => {
            if (err) return res.send(500, err);
            res.redirect("/");
        });
    });

// delete method
// example of route concept
app.route("/remove/:id").get((req, res) => {
    const id = req.params.id;
    TodoTask.findByIdAndRemove(id, err => {
        if (err) return res.send(500, err);
        res.redirect("/");
    });
});

