const express = require("express");
const cors = require("cors");
const scrapeMemes = require("./puppet.js");

const fs = require("fs");

const port = 3030;

const app = express();

app.use(
  cors({
    origin: "http://localhost:3000",
    credentials: true,
  })
);

app.get("/", async (_req, res) => {
  // Search phrases
  try {
    const bad = await scrapeMemes("bad");
    const good = await scrapeMemes("good");
    const amazing = await scrapeMemes("amazing");

    // Create an array of meme objects
    const memesArray = {
      memes: [
        { category: "bad", imageUrl: bad },
        { category: "good", imageUrl: good },
        { category: "amazing", imageUrl: amazing },
      ],
    };

    fs.writeFile("memes.json", JSON.stringify(memesArray), (err) => {
      if (err) throw err;
      console.log("The file has been saved!");
    });

    res.status(200).json(memesArray);
  } catch (error) {
    console.error("Error:", error);
    //error code
    res.status(500).send("An error occurred");
  }
});

app.get("/memes", async (_req, res) => {
  try {
    const memes = fs.readFileSync("memes.json");
    res.status(200).json(JSON.parse(memes));
  } catch (error) {
    console.error("Error:", error);
    //error code
    res.status(500).send("An error occurred");
  }
});

app.listen(port, () =>
  console.log(`Example app listening on http://localhost:${port}`)
);
