import express from 'express';
import cors from 'cors';
import db, { ColumnInfo, Entry } from "../db";
import type { Statement } from 'better-sqlite3';

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


/** ROUTE SPECIFICALLY FOR TOOLING **/
const sqlRegex = /\s(?=\bSELECT\b|\bINSERT\b|\bUPDATE\b|\bDELETE\b|\bDROP\b|\bCREATE\b)/gi

router.get("/dev/", (req, res) => {
    try {
        const code = req.query['code'] as string;
        if(!code) 
            throw Error("Missing code")

        const stmts = code
            .split(sqlRegex)
            .map(cmd => ({
                willQuery: cmd.match(/\bSELECT\b/i) !== null,
                stmt: db.prepare(cmd),
                src: cmd
            }));

        if(stmts.length === 0) 
            throw Error("No valid SQLite statements")

        let output: string[] = [];
        const runAll = db.transaction((stmts: {willQuery: boolean, stmt: Statement, src: string}[]) => 
            stmts.forEach(({willQuery, stmt, src}) => {
                if(willQuery) {
                    console.log(`${'-'.repeat(50)}\n${src}\n${JSON.stringify(stmt.all())}`);
                    //output.push('-'.repeat(50) + JSON.stringify(stmt.all()));
                    output.push(`${'-'.repeat(50)}\n${src}\n${JSON.stringify(stmt.all())}`)
                }
                else {
                    stmt.run();
                }
            })
        );
        
        runAll(stmts);
        res.status(200).send(output.join("\n"))
    } catch (error) {
        res.sendStatus(400);
    }
});

export default router;