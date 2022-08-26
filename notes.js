const express = require("express");
const expressSession = require("express-session");
const bodyParser = require("body-parser");

const app = express();

app.use(
  expressSession({
    secret: "notes app",
    resave: true,
    saveUninitialized: true,
  }),
);

app.get("/", function (req, res) {
  if (!req.session.notes) req.session.notes = [];
  res.render("notes.pug", { notes: req.session.notes });
});

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.post("/", function (req, res) {
  const note = req.body.note;
  if (!req.session.notes) req.session.notes = [];
  req.session.notes.push(note);
  res.render("notes.pug", { notes: req.session.notes });
});

app.get("/del/:id", function (req, res) {
  const { params, session } = req;
  const { id } = params;
  let { notes = [] } = session;

  console.log("id, notes", id, notes);

  notes = notes.filter((item) => item !== id);
  res.render("notes.pug", { notes });
});

app.listen(4000);
