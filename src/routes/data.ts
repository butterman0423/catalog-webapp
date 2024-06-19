import express from 'express';
import cors from 'cors';
import { DB } from "../db";
import type { SqliteError, Statement } from 'better-sqlite3';
import fileUpload from 'express-fileupload'

import { checkRow } from '../validator'
import { process } from 'src/merger';

type FileInfo = {
    name: string,
    tempFilePath: string
}

const db = new DB("sample1");
const router = express.Router();

router.use(cors());
router.use(express.json());
router.use(fileUpload({ 
    useTempFiles: true 
}))

router.route('/')
    .get((req, res) => {
        const query = db.select();
        res.send({ data: query });
    })
    .post((req, res) => {
        const headers = db.headers()
            .filter(({ pk, name }) => !pk && name !== 'uuid');
        const dat = req.body;

        checkRow(dat, headers);

        const uuid = db.insert(dat);
        res.send(uuid);
    });

router.put("/:uuid/", (req, res) => {
    const key = req.params["uuid"];
    const headers = db.headers()
            .filter(({ pk, name }) => !pk && name !== 'uuid');
    const dat = req.body;

    checkRow(dat, headers);

    db.update(key, req.body);
    res.sendStatus(200);
});

router.get("/headers/", (req, res) => {
    const headers = db.headers();
    res.send(headers.filter(({pk}) => !pk));
});

router.post("/import", async (req, res) => {
    const file = req.files?.file;
    if(!file) {
        res.sendStatus(400);
        return;
    }
    
    let { name, tempFilePath } = file as FileInfo;
    const ext = name.substring(name.indexOf('.') + 1);

    switch(ext) {
        case 'csv':
            await process(tempFilePath, db)
            break;
        default:
            res.sendStatus(400);
            return;
    }

    res.sendStatus(200);
})


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