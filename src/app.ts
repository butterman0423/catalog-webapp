import express from "express";
import { join } from "node:path"
import db_router from "./db";

const app = express();

app.use( express.static(join(__dirname, "public")) );
app.use("/scripts", express.static(join(__dirname, "build")));
app.use("/data", db_router);

app.get('/', (_req, res) => {
    res.redirect("/home.html");
})

const PORT = 3000;

app.listen(PORT, () => {
    console.log(`Server running on: http://localhost:${PORT}/`)
})