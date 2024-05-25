import express from 'express';
import cors from 'cors'

import type { ColumnInfo } from '../db';
import db, { init } from '../db';

init();

// Handle database requests
const router = express.Router();

router.use(cors());
router.use(express.json());

/** Route / **/
router.route("/")

// Query data
.get((_req, res) => {
    const query = db.prepare("SELECT * FROM sample");
    const data = query.all();

    res.send(data);
})

// Inserting new rows
.post((req, res) => {
    const stmt = db.prepare(`INSERT INTO sample (dtype, data) VALUES (@dtype, @data)`);

    const dat = req.body as {dtype: string, data: string};
    const ret = stmt.run(dat)
    
    res.send(`${ret.lastInsertRowid}`);
})

// Updating existing rows
.put((req, res) => {
    
});

/** Route /headers/ **/

// Retrieve valid column names
router.get("/headers/", (_req, res) => {
    const tinfo = db.pragma('table_info(sample)') as ColumnInfo[];
    const heads = tinfo
        .filter(col => !col.pk)
        .map(col => col.name);

    res.send(heads);
});

export default router;