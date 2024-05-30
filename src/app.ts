import express from "express";
import { join } from "node:path"

import root_router from "./routes/root";
import data_router from "./routes/data";

const app = express();

app.use( "/bootstrap/", express.static(join(__dirname, "node_modules/bootstrap/dist")) );
app.use( "/datatables/", express.static(join(__dirname, "node_modules/datatables.net/js")))
app.use( "/datatables-bs5/", express.static(join(__dirname, "node_modules/datatables.net-bs5")) );
app.use( "/jquery/", express.static(join(__dirname, "node_modules/jquery/dist")) );
app.use( "/data/ ", data_router);
app.use( "/", express.static(join(__dirname, "public")), root_router );

app.get("/", (_req, res) => {
    res.redirect("/home/");
})

const PORT = 3000;
app.listen(PORT, () => {
    console.log(`Server running on: http://localhost:${PORT}/`)
})