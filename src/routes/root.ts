import express from 'express';
import db, { ColumnInfo, Entry } from "../db";

import Table from '../templates/table';

// Serve rendered html files

const router = express.Router();

router.get("/", (_req, res) => {
    res.redirect("/home/");
})

router.get("/home/", (req, res) => {
    const qstmt = db.prepare("SELECT * FROM sample");
        
    const query = qstmt.all() as Entry[];
    const headers = (db.pragma("table_info(sample)") as ColumnInfo[])
        .filter(col => !col.pk)

    res.send(`
        <!DOCTYPE html>
        <html>
            <head>
                <title>Catalog</title>
                <link rel="stylesheet" type="text/css" href="/styles/style.css"/>
            </head>
            <body>
                ${Table.build({ data: query, headers: headers })}
            </body>
        </html>
    `);
})

export default router;