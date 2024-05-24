import express from "express";
import { join } from "node:path"

import db_router from "./routes/data";
import root_router from "./routes/root";

const app = express();

app.use( express.static(join(__dirname, "public")) );
app.use("/data", db_router);
app.use("/", root_router);

const PORT = 3000;

app.listen(PORT, () => {
    console.log(`Server running on: http://localhost:${PORT}/`)
})