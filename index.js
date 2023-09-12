const express = require("express");
const fs = require("fs");

const app = express();
const port = 6000;

app.use(express.json());


app.get("/", async(req, res) => {
    const quiz = await JSON.parse(fs.readFileSync("./data/quiz.json"))
    res.send(quiz);
});

app.post("/register", async (req, res) => {});

app.post("/login", async (req, res) => {
  const username = req.body.username;
  const password = req.body.password;
  const users = JSON.parse(fs.readFileSync("./data/users.json"));

  users
    .find((user) => user.username === username && user.password === password)
    .then((result) => {
      if (result) {
        res.send("Login Success");
      } else {
        res.send("Login Failed");
      }
    })
    .catch((err) => {
        res.send("User not found");
    });
});

app.get("/questions", async (req, res) => {});

app.listen(port, () => console.log(`Example app listening on port ${port}!`));
