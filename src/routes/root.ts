import express from 'express';
import cors from 'cors';

import db, { init, ColumnInfo, Entry } from "../db";

import HTML from "../templates/html";
import HomePage from '../templates/home-page';

init();

// Serve rendered html files

const router = express.Router();

router.use(cors());
router.use(express.json());

router.get('/home/', (req, res) => {
    const qstmt = db.prepare("SELECT * FROM sample");
        
    const query = qstmt.all() as Entry[];
    const headers = (db.pragma("table_info(sample)") as ColumnInfo[])

    res.send( HTML.build({
        title: "Catalog",
        body: HomePage.build({ headers: headers, query: query }),
        omit: { myStyles: true }
    }) );
})

export default router;