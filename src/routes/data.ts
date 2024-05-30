import express from 'express';
import cors from 'cors';
import db, { ColumnInfo, Entry } from "../db";

const router = express.Router();

router.use(cors());
router.use(express.json());

router.route('/')
    .get((req, res) => {
        const qstmt = db.prepare("SELECT * FROM sample");
        const query = qstmt.all() as Entry[];

        res.send(query);
    })
    .post((req, res) => {
        const stmt = db.prepare(`INSERT INTO sample (dtype, data) VALUES (:dtype, :data)`);
        const dat = req.body as {dtype: string, data: string};
        stmt.run(dat)
        
        res.sendStatus(200);
    });

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
});

export default router;