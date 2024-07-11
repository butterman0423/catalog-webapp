import type { Statement } from 'better-sqlite3';
import type { DB } from 'src/utils/db';
import type { Dict } from 'src/utils/types'

import { guessCSVConfig, getCSVHeaders, csvToJSON } from './parsers/csv-parser';
import { parseSQL } from './parsers/db-parser';
import { hasValidColumns, checkRow } from './checks/db-check';

type MappedStmt = {
    willQuery: boolean,
    stmt: Statement,
    src: string
}

type SQLResult = {
    query: string,
    dat: any,
    cols: string[]
}

export async function processCSV(path: string, db: DB<any>) {
    const headers = db.headers()
        .filter(({ pk }) => !pk);

    const reqs = headers.map( ({ name }) => name );
    const inHeads = await getCSVHeaders(path);

    if(!inHeads)
        //throw Error("Failed to parse column headers");
        return;
    if(!hasValidColumns(inHeads, reqs)) {
        return;
    }

    const conf = await guessCSVConfig(path);
    const json = await csvToJSON(path, conf);

    json.forEach(v => { 
        const res = checkRow(v, headers);
        if(!res.passed) {
            console.log(res.details.toString());
            return;
        }
    });

    // Push to DB
    const merge = db.raw().transaction((items: Dict[]) => {
        for(let item of items) {
            const uuid = item.uuid;
            delete item.id;

            if(uuid) 
                db.update(uuid, item);
            else
                db.insert(item)
        }
    });

    merge(json);
}

export async function execSQL(db: DB<any>, code: string): Promise<SQLResult[]> {
    const rdb = db.raw();
    const stmts = parseSQL(code)
        .map(cmd => ({
            willQuery: cmd.match(/\bSELECT\b/i) !== null,
            stmt: rdb.prepare(cmd),
            src: cmd
        }));

    if(stmts.length === 0) 
        throw Error("No valid SQLite statements")

    const output: SQLResult[] = [];
    const runAll = rdb.transaction((stmts: MappedStmt[]) => 
        stmts.forEach( ({ willQuery, stmt, src }) => {
            if(willQuery) {
                const dat = stmt.raw().all() as any;
                const cols = stmt.columns()
                    .map(({ name }) => name);
                output.push({ query: src, dat, cols });
            }
                
            else
                stmt.run();
        })
    );
    
    runAll(stmts);

    return output;
}