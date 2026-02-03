const express = require("express");
const { ObjectId } = require("mongodb");
const { connectDB } = require("../config/database.js");

const router = express.Router();

// CREATE
router.post("/", async (req, res) => {
  try {
    const db = await connectDB();

    if (!Array.isArray(req.body)) {
      return res.status(400).json({ error: "Esperado um array de filmes" });
    }

    const result = await db
      .collection("movies")
      .insertMany(req.body, { ordered: false });

    res.status(201).json({
      insertedCount: result.insertedCount,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
});

// READ ALL
router.get("/", async (req, res) => {
  try {
    const db = await connectDB();
    const movies = await db.collection("movies").find().toArray();

    res.json(movies);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// READ BY ID
router.post("/", async (req, res) => {
  try {
    const db = await connectDB();

    if (!Array.isArray(req.body)) {
      return res.status(400).json({ error: "Esperado um array de filmes" });
    }

    const result = await db.collection("movies").insertMany(req.body);

    res.status(201).json({
      inserted: result.insertedCount,
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// UPDATE
router.put("/:id", async (req, res) => {
  try {
    const db = await connectDB();
    const result = await db
      .collection("movies")
      .updateOne({ _id: new ObjectId(req.params.id) }, { $set: req.body });

    res.json(result);
  } catch (err) {
    res.status(400).json({ error: "Erro ao atualizar" });
  }
});

// DELETE
router.delete("/:id", async (req, res) => {
  try {
    const db = await connectDB();
    const result = await db
      .collection("movies")
      .deleteOne({ _id: new ObjectId(req.params.id) });

    res.json(result);
  } catch (err) {
    res.status(400).json({ error: "Erro ao deletar" });
  }
});

module.exports = router;
