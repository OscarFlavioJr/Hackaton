const express = require("express");
const { ObjectId } = require("mongodb");
const { connectDB } = require("../config/database");

const router = express.Router();

router.post("/", async (req, res) => {
  try {
    const db = await connectDB();

    if (!Array.isArray(req.body)) {
      return res.status(400).json({ error: "Esperado um array de filmes" });
    }

    if (req.body.length === 0) {
      return res.status(400).json({ error: "Array de filmes vazio" });
    }

    const result = await db
      .collection("movies")
      .insertMany(req.body, { ordered: false });

    return res.status(201).json({
      insertedCount: result.insertedCount,
    });
  } catch (err) {
    console.error("[MOVIES CREATE]", err.message);
    return res.status(500).json({ error: err.message });
  }
});

router.get("/", async (req, res) => {
  try {
    const db = await connectDB();

    const limit = Math.min(Number(req.query.limit) || 50, 100);
    const offset = Number(req.query.offset) || 0;

    const movies = await db
      .collection("movies")
      .find()
      .skip(offset)
      .limit(limit)
      .toArray();

    return res.json({
      total: movies.length,
      movies,
    });
  } catch (err) {
    console.error("[MOVIES READ]", err.message);
    return res.status(500).json({ error: err.message });
  }
});

router.get("/:id", async (req, res) => {
  try {
    const db = await connectDB();

    const movie = await db
      .collection("movies")
      .findOne({ _id: new ObjectId(req.params.id) });

    if (!movie) {
      return res.status(404).json({ error: "Filme não encontrado" });
    }

    return res.json(movie);
  } catch (err) {
    return res.status(400).json({ error: "ID inválido" });
  }
});

router.put("/:id", async (req, res) => {
  try {
    const db = await connectDB();

    const result = await db
      .collection("movies")
      .updateOne({ _id: new ObjectId(req.params.id) }, { $set: req.body });

    if (result.matchedCount === 0) {
      return res.status(404).json({ error: "Filme não encontrado" });
    }

    return res.json({ updated: true });
  } catch (err) {
    return res.status(400).json({ error: "Erro ao atualizar filme" });
  }
});

router.delete("/:id", async (req, res) => {
  try {
    const db = await connectDB();

    const result = await db
      .collection("movies")
      .deleteOne({ _id: new ObjectId(req.params.id) });

    if (result.deletedCount === 0) {
      return res.status(404).json({ error: "Filme não encontrado" });
    }

    return res.json({ deleted: true });
  } catch (err) {
    return res.status(400).json({ error: "Erro ao deletar filme" });
  }
});

module.exports = router;
