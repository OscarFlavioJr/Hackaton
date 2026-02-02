import dotenv from "dotenv";
dotenv.config();

import express from "express";
import movieRoutes from "./routes/movie.routes.js";

const app = express();
app.use(express.json());

app.use("/movies", movieRoutes);

app.listen(process.env.PORT || 3000);
