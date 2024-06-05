import express from 'express';
import cors from 'cors';

import db, { init, ColumnInfo, Entry } from "../db";

import HTML from "../templates/html";
import HomePage from '../templates/home-page';
import ToolPage from '../templates/tool-page'

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
        js: "/scripts/home/loader.js",
    }) );
});

router.get('/tool/', (req, res) => {
    res.send( HTML.build({
        title: "Catalog: Tool",
        body: ToolPage.build(),
        js: "/scripts/tool/loader.js",
        omit: { datatables: true, myStyles: true }
    }) );
})

export default router;