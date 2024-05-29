import express from 'express';
import cors from 'cors';

import db, { init, ColumnInfo, Entry } from "../db";

import Table from '../templates/table';
import Pager from "../templates/pager";
import Form from "../templates/form";
import Dropdown from "../templates/dropdown";

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
                <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap@3.4.1/dist/css/bootstrap.min.css" 
                    integrity="sha384-HSMxcRTRxnN+Bdg0JdbxYKrThecOKuH5zCYotlSAcp1+c8xmyTe9GYg1l9a69psu" 
                    crossorigin="anonymous"/>
                
                <link rel="stylesheet" type="text/css" href="/styles/style.css"/>
                <script src="https://code.jquery.com/jquery-3.7.1.min.js"></script>
            </head>
            <body>
                <div class="container">
                    
                    <div class="btn-toolbar">
                        ${Dropdown.build({ title: "TODO", items: ["test"]})}

                        <div class="btn-group">
                            <button class="btn btn-default">T</button>
                            <button class="btn btn-default">T</button>
                            <button class="btn btn-default">T</button>
                        </div>

                        <div class="btn-group pull-right">
                            <button class="btn btn-default add-btn">
                                <span class="glyphicon glyphicon-plus" aria-hidden="true"></span>
                            </button>
                        </div>
                    </div>
                    
                    <div class="tbl-container">
                        ${Table.build({ data: query, headers: headers })}
                    </div>
                    
                    <div class="col-md-12" style="padding:0">
                        <div class="pull-right">
                            ${Pager.build({})}
                        </div>
                    </div>

                    ${Form.build({ headers: headers })}
                </div>
                

                <script src="https://cdn.jsdelivr.net/npm/bootstrap@3.4.1/dist/js/bootstrap.min.js" 
                    integrity="sha384-aJ21OjlMXNL5UyIl/XNwTMqvzeRMZH2w8c5cRVpzpU8Y5bApTppSuUkhZXN0VxHd" 
                    crossorigin="anonymous"></script>
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