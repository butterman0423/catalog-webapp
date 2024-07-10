import express from "express";
import { join } from "node:path"

import root_router from "./routes/root";
import data_router from "./routes/data.js";

const app = express();

app.use( "/data/", data_router);
app.use( "/", express.static(join(__dirname, "public")), root_router );

app.get("/", (_req, res) => {
    res.redirect("/home/");
})

const PORT = 3000;
app.listen(PORT, () => {
    console.log(`Server running on: http://localhost:${PORT}/`)
})