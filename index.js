const express = require("express");
const fs = require("fs");
const session = require("express-session");

const app = express();
const port = 6000;

app.use(express.json());

app.use(session({
    secret: "secret-key",
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false }
}))

const isAuth = (req, res, next) => {
    if (req.session.username) {
        next();
    } else {
        res.send("Not Authenticated");
    }
}

app.get("/", isAuth, async(req, res) => {
    const quiz = await JSON.parse(fs.readFileSync("./data/quiz.json"))
    res.send(quiz);
});

app.post("/register", async (req, res) => {
    const username = req.body.username;
    const password = req.body.password;

    const users = await JSON.parse(fs.readFileSync("./data/users.json"));

    users.push({username, password}).then(() => {
        res.send("User registered");
    }).catch((err) => {
        res.send("Error registering user");
    })
});

app.post("/login", async (req, res) => {
  const username = req.body.username;
  const password = req.body.password;
  const users = JSON.parse(fs.readFileSync("./data/users.json"));

  users
    .find((user) => user.username === username && user.password === password)
    .then((result) => {
      if (result) {
        req.session.username = username;
        res.send(username);
      } else {
        res.send("Login Failed");
      }
    })
    .catch((err) => {
        res.send("User not found");
    });
});

app.get("/questions", isAuth, async (req, res) => {
    const questions = await JSON.parse(fs.readFileSync("./data/questions.json"));
    res.send(questions);
});

app.listen(port, () => console.log(`Example app listening on port ${port}!`));
