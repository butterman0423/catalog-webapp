import express from "express";
import { join } from "node:path"
import db from "./db";

const app = express();

app.use( express.static(join(__dirname, "public")) );

app.get('/', (_req, res) => {
    //res.send("Hello World")
    res.redirect("/home.html");
})

const PORT = 3000;

app.listen(PORT, () => {
    console.log(`Server running on: http://localhost:${PORT}/`)
})