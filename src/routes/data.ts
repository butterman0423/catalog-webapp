import express from 'express';
import cors from 'cors';
import { DB } from "../db";
import type { SqliteError, Statement } from 'better-sqlite3';

const db = new DB("sample1", { 
    id: "INTEGER PRIMARY KEY AUTOINCREMENT", 
    dtype: "TEXT NOT NULL", 
    data: "TEXT NOT NULL"}
);
const router = express.Router();

router.use(cors());
router.use(express.json());

router.route('/')
    .get((req, res) => {
        const query = db.select();
        res.send(query);
    })
    .post((req, res) => {
        const { lastInsertRowid } = db.insert(req.body);

        //res.sendStatus(200);
        res.send(`${lastInsertRowid}`);
    });

router.put("/:pk([0-9]+)/", (req, res) => {
    const key = parseInt(req.params["pk"]);
    if(key === 0) {
        res.sendStatus(406);
        return;
    }

    db.update(key, req.body);
    res.sendStatus(200);
});


/** ROUTE SPECIFICALLY FOR TOOLING **/
const sqlRegex = /\s(?=\bSELECT\b|\bINSERT\b|\bUPDATE\b|\bDELETE\b|\bDROP\b|\bCREATE\b)/gi

router.get("/dev/", (req, res) => {
    // For simplicity, use the raw SQLite Database
    const rdb = db.raw();
    try {
        const code = req.query['code'] as string;
        if(!code) 
            throw Error("Missing code")

        const stmts = code
            .split(sqlRegex)
            .map(cmd => ({
                willQuery: cmd.match(/\bSELECT\b/i) !== null,
                stmt: rdb.prepare(cmd),
                src: cmd
            }));

        if(stmts.length === 0) 
            throw Error("No valid SQLite statements")

        let output: string[] = [];
        const runAll = rdb.transaction((stmts: {willQuery: boolean, stmt: Statement, src: string}[]) => 
            stmts.forEach( ({ willQuery, stmt, src }) => {
                if(willQuery)
                    //output.push(`${'-'.repeat(50)}\n${src}\n${JSON.stringify(stmt.all())}`)
                    output.push(`
                    <div>
                        <div>${'-'.repeat(50)}</div>
                        <div>${src}</div>
                        <div>${JSON.stringify(stmt.all()).slice(1, -1)}</div>
                    </div>
                    `);
                else
                    stmt.run();
            })
        );
        
        runAll(stmts);
        res.status(200).send(output.join("\n"))
    } catch (error) {
        console.log(error);
        res.status(400).send((error as Error).toString());
    }
});

export default router;