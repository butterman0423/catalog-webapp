import express from 'express';
import db, { init, ColumnInfo, Entry } from "../db";

import Table from '../templates/table';

init();

// Serve rendered html files

const router = express.Router();

router.route("/")

.get((req, res) => {
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

.post((req, res) => {
    const stmt = db.prepare(`INSERT INTO sample (dtype, data) VALUES (@dtype, @data)`);

    const dat = req.body as {dtype: string, data: string};
    stmt.run(dat)
    
    res.redirect(req.baseUrl);
})

.put((req, res) => {
    res.sendStatus(403);
})

export default router;