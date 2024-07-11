import express from 'express';
import cors from 'cors';
import fileUpload from 'express-fileupload'

import { DB } from "src/utils/db";
import { checkRow } from 'src/utils/checks/db-check';
import { execSQL, processCSV } from 'src/utils/processor';
import { parseSQL } from 'src/utils/parsers/db-parser';

type FileInfo = {
    name: string,
    tempFilePath: string
}

const db = new DB("transactions", "transactions");
const router = express.Router();

router.use(cors());
router.use(express.json());
router.use(fileUpload({ 
    useTempFiles: true 
}))

router.route('/')
    .get((req, res) => {
        delete req.query['_'];  // Temporary
        
        const qkeys = Object.keys(req.query);
        let sel: any | null = null;

        if(qkeys.length > 0) {
            sel = qkeys
                .map((k) => {
                    // TODO: Add key validation

                    const v = req.query[k] as string[];
                    if(!v)
                        throw Error(`Invalid query parameter: ${k}=${v}`);

                    return {
                        target: k,
                        op: v[0],
                        to: v.length > 2 ? v.slice(1) : v[1]
                    }
                });
        }

        const query = db.select('all', sel);
        res.send({ data: query });
    })
    .post((req, res) => {
        const headers = db.headers()
            .filter(({ pk, name }) => !pk && name !== 'uuid');
        const dat = req.body;

        const valRes = checkRow(dat, headers);
        if(!valRes.passed) {
            res.status(403).send(valRes.details);
            return;
        }

        const uuid = db.insert(dat);
        res.send(uuid);
    });

router.put("/:uuid/", (req, res) => {
    const key = req.params["uuid"];
    const headers = db.headers()
            .filter(({ pk, name }) => !pk && name !== 'uuid');
    const dat = req.body;

    const valRes = checkRow(dat, headers);
    if(!valRes.passed) {
        res.status(403).send(valRes.details);
        return;
    }

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
    
    const { name, tempFilePath } = file as FileInfo;
    const ext = name.substring(name.indexOf('.') + 1);

    switch(ext) {
        case 'csv':
            await processCSV(tempFilePath, db)
            break;
        default:
            res.sendStatus(400);
            return;
    }

    res.sendStatus(200);
})


/** ROUTE SPECIFICALLY FOR TOOLING **/
router.get("/dev/", async (req, res) => {
    try {
        const code = req.query['code'] as string;
        if(!code) 
            throw Error("Missing code")
        
        const output = await execSQL(db, code);
        res.send(output);
    } catch (error) {
        console.error(error);
        res.status(400).send((error as Error).toString());
    }
});

export default router;