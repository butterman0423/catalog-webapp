import express from 'express';
import cors from 'cors';

import HTML from "../templates/html";
import HomePage from '../templates/home-page';
import ToolPage from '../templates/tool-page'

import { DB } from "../utils/db"

const db = new DB("transactions", "transaction");
db.init();

// Serve rendered html files

const router = express.Router();

router.use(cors());
router.use(express.json());

router.get('/home/', (req, res) => {
    const headers = db.headers();
    res.send( HTML.build({
        title: "Catalog",
        body: HomePage.build({ headers: headers }),
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