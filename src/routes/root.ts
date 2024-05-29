import express from 'express';
import cors from 'cors';

import db, { init, ColumnInfo, Entry } from "../db";

import Table from '../templates/table';

init();

// Serve rendered html files

const router = express.Router();

router.use(cors());
router.use(express.json());

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
                <div class="app-container">
                    <div class="tool-container">
                        <div class="tool-inner-container">
                            <select></select>
                        </div>

                        <div class="tool-inner-container">
                            <button>T</button>
                            <button>T</button>
                        </div>
                    </div>

                    <div class="tool-container">
                        <div class="tool-inner-container ftool-right">
                            <button class="tbl-tool btn-tool add-btn">+</button>
                        </div>
                    </div>
                    
                    <div class="tbl-container">
                        ${Table.build({ data: query, headers: headers })}
                    </div>

                    <div class="tool-container">
                        <div class="tool-inner-container">
                            <input type="number"/>
                            of #
                        <div>
                    </div>
                </div>

                <script src="/scripts/home-loader.js"></script>
            </body>
        </html>
    `);
})

.post((req, res) => {
    const stmt = db.prepare(`INSERT INTO sample (dtype, data) VALUES (:dtype, :data)`);
    const dat = req.body as {dtype: string, data: string};
    stmt.run(dat)
    
    res.sendStatus(200);
})

router.put("/:pk([0-9]+)/", (req, res) => {
    const key = req.params["pk"];
    if(key === "0") {
        res.sendStatus(406);
        return;
    }

    const dat = req.body as {dtype: string, data: string};
    const update = db.prepare("UPDATE sample SET dtype = :dtype, data = :data WHERE id = :id")
    update.run({id: key, ...dat});

    res.sendStatus(200);
})

export default router;