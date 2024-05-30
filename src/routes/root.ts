import express from 'express';
import cors from 'cors';

import db, { init, ColumnInfo, Entry } from "../db";

import Table from '../templates/table';
import Form from "../templates/form";
import Dropdown from "../templates/dropdown";
import Modal from "../templates/modal";

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

    res.send(`
        <!DOCTYPE html>
        <html>
            <head>
                <title>Catalog</title>

                <link rel="stylesheet" href="/bootstrap/css/bootstrap.min.css"/>
                <link rel="stylesheet" type="text/css" href="/datatables-bs5/css/dataTables.bootstrap5.min.css"/>
                <link rel="stylesheet" type="text/css" href="/styles/style.css"/>
            </head>
            <body>
                <div class="container">
                    
                    <div class="btn-toolbar">
                        ${Dropdown.build({ title: "TODO", items: ["test"]})}

                        <div class="btn-group">
                            <button class="btn btn-default">New</button>
                            <button class="btn btn-default">Import</button>
                            <button class="btn btn-default">Export</button>
                        </div>

                        <div class="btn-group pull-right">
                            <button id="edit-btn" class="btn btn-default">
                                Edit
                            </button>
                            <button id="add-btn" class="btn btn-default" data-toggle="modal" data-target="#db-form-modal">
                                Add
                            </button>
                        </div>
                    </div>
                    
                    <div class="tbl-container">
                        ${Table.build({ data: query, headers: headers })}
                    </div>

                    ${ Modal.build({ title: "Add New Row", body: Form.build({ headers: headers }) }) }
                </div>
                
                <script src="/jquery/jquery.min.js"></script>
                <script src="/bootstrap/js/bootstrap.min.js"></script>
                <script src="/datatables/dataTables.min.js"></script>
                <script src="/datatables-bs5/js/dataTables.bootstrap5.js"></script>
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