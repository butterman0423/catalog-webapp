import express from 'express';
import cors from 'cors';

import HTML from "../templates/html";
import HomePage from '../templates/home-page';
import ToolPage from '../templates/tool-page'

import { DB } from "../db"

const db = new DB("sample1", { 
    id: "INTEGER PRIMARY KEY AUTOINCREMENT", 
    dtype: "TEXT NOT NULL", 
    data: "TEXT NOT NULL"}
);
db.init();

// Serve rendered html files

const router = express.Router();

router.use(cors());
router.use(express.json());

router.get('/home/', (req, res) => {
    const query = db.select();
    const headers = db.headers();
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