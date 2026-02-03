require("dotenv").config();

const express = require("express");
const movieRoutes = require("./routes/movie.routes");

const app = express();
app.use(express.json({ limit: "100mb" }));

app.use("/movies", movieRoutes);

app.listen(3000);
