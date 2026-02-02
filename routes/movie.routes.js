import express from "express";
import { ObjectId } from "mongodb";
import { connectDB } from "../config/database.js";

const router = express.Router();

// CREATE
router.post("/", async (req, res) => {
  try {
    const db = await connectDB();
    const result = await db.collection("movies").insertOne(req.body);
    res.status(201).json(result);
  } catch (err) {
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
router.get("/:id", async (req, res) => {
  try {
    const db = await connectDB();
    const movie = await db
      .collection("movies")
      .findOne({ _id: new ObjectId(req.params.id) });

    if (!movie) {
      return res.status(404).json({ message: "Filme não encontrado" });
    }

    res.json(movie);
  } catch (err) {
    res.status(400).json({ error: "ID inválido" });
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

export default router;
