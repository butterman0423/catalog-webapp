import express from "express";
import { join } from "node:path"

import root_router from "./routes/root";
import ui_router from "./routes/ui";

const app = express();

app.use( express.static(join(__dirname, "public")) );
app.use("/ui/", ui_router);
app.use("/home/", root_router);

app.get('/', (_req, res) => {
    res.redirect("/home/");
})
const PORT = 3000;

app.listen(PORT, () => {
    console.log(`Server running on: http://localhost:${PORT}/`)
})