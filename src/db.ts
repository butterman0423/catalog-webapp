import Database from 'better-sqlite3';
import express from 'express';
import cors from 'cors'

interface ColumnInfo {
    cid: number,
    name: string,
    type: string,
    notnull: boolean,
    dflt_value: any,
    pk: boolean
}

const db = new Database(":memory:");

db.prepare(`CREATE TABLE sample (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    dtype TEXT NOT NULL,
    data TEXT)`
).run();

const insert = db.prepare(`INSERT INTO sample (dtype, data) VALUES (?, ?)`)

insert.run("number", "1");
insert.run("text", "hello");
insert.run("datetime", "05212024:15:11:00");

const router = express.Router();

router.use(cors());
router.use(express.json());

router.get("/", (_req, res) => {
    const query = db.prepare("SELECT * FROM sample");
    const data = query.all();

    res.send(data);
});

router.post("/", (req, res) => {
    const dat = req.body as {dtype: string, data: string};
    const ret = insert.run(dat.dtype, dat.data);
    
    res.send(`${ret.lastInsertRowid}`);
})

router.get("/headers/", (_req, res) => {
    const tinfo = db.pragma('table_info(sample)') as Array<ColumnInfo>;
    const heads = tinfo
        .filter(col => !col.pk)
        .map(col => col.name);

    res.send(heads);
});

export default router;