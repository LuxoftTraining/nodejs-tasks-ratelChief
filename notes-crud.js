const express = require("express");
const path = require("path");
const expressSession = require("express-session");
const bodyParser = require("body-parser");
const fs = require("fs").promises;
const { pipe } = require("./utils");

const app = express();

app.use(express.static(path.join(__dirname, "./public")));

const convertToString = (file) => file.toString().trim();
const convertToJSON = (string) => string.split("\n").map(JSON.parse);
const convertObjectToSavedFormat = (data) =>
  data.reduce((acc, item) => {
    const string = JSON.stringify(item);
    return [acc, string].join("\n");
  }, "");

app.use(
  expressSession({
    secret: "node_tutorial",
    resave: true,
    saveUninitialized: true,
  }),
);

app.get("/notes", async (req, res) => {
  const file = await fs.readFile("notes.json");
  const text = convertToString(file);

  if (text) {
    const response = convertToJSON(text);
    return res.send(response);
  }

  res.send([]);
});

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.post("/notes", async (req, res) => {
  const note = JSON.stringify({ ...req.body, id: `${new Date().getTime()}` });

  try {
    await fs.appendFile("notes.json", `${note}\n`);
  } catch (error) {
    console.log("error in /post/notes", textInNotes);
  }

  res.end();
});

app.delete("/notes/:id", async (req, res) => {
  const { id } = req.params;
  const file = await fs.readFile("notes.json");
  const data = pipe(
    convertToString,
    convertToJSON,
    (data) => data.filter((item) => item.id !== id),
    convertObjectToSavedFormat,
  )(file);

  fs.writeFile("notes.json", data);

  res.sendStatus(204);
});

app.listen(4000);
