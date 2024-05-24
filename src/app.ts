import express from "express";
import { join } from "node:path"
import db_router from "./db";

const app = express();

app.use( express.static(join(__dirname, "public")) );
app.use("/data", db_router);

app.get('/', (_req, res) => {
    res.send(`
        <!DOCTYPE html>
        <html>
            <head>
                <title>Catalog</title>
                <link rel="stylesheet" type="text/css" href="/styles/style.css"/>
            </head>
            <body>
                Hello World
            </body>
        </html>
    `);
})

const PORT = 3000;

app.listen(PORT, () => {
    console.log(`Server running on: http://localhost:${PORT}/`)
})