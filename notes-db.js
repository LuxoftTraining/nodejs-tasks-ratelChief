const { MongoClient, ObjectId } = require("mongodb");
let notes;
(async () => {
  const client = new MongoClient("mongodb://localhost:27017");
  await client.connect();
  let db = client.db("tutor");
  notes = db.collection("notes");
})();

const express = require("express");
const path = require("path");
const bodyParser = require("body-parser");

const app = express();

app.use(express.static(path.join(__dirname, "./public")));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.get("/notes", async (req, res) => {
  const cursor = await notes.find(req.query);
  const items = await cursor.toArray();
  res.send(items);
});

app.post("/notes", async (req, res) => {
  await notes.insertOne(req.body);
  res.end();
});

app.delete("/notes/:id", async (req, res) => {
  const id = new ObjectId(req.params.id);
  const result = await notes.deleteOne({ _id: id });

  if (result.deletedCount === 1) {
    return res.send({ ok: true });
  }

  res.send({ ok: false });
});

app.put("/notes/:id", async (req, res) => {
  const { value } = req.body;
  const id = new ObjectId(req.params.id);
  await notes.updateOne({ _id: id }, { $set: { text: value } });
  return res.send({ ok: true });
});

app.listen(4000);
