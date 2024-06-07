import type SQLite3 from 'better-sqlite3';
import Database from 'better-sqlite3';
import { join } from 'node:path'
import DEFAULT from 'default_tbl.json'

const DB_PATH = join(__dirname, "/data/data.db");

type Config = { [key: string]: string };
type FieldArgs<T> = { [k in keyof T as Exclude<k, "id">]: string | number }

function makeSlots(pttn: string, amount: number) {
    return pttn + `, ${pttn}`.repeat(amount - 1);
}

// Manual SQL injection check
function check(str: string) {
    if(str.match(/--/) !== null)
        throw Error(`FATAL: INJECTION DETECTED with ${str}`)
}

export type Entry = { [key: string]: any };
export type ColumnInfo = {
    cid: number,
    name: string,
    type: string,
    notnull: boolean,
    dflt_value: any,
    pk: boolean
}
export class DB<Fields extends Config> {
    db: SQLite3.Database
    conf: Fields
    name: string

    constructor(name: string, conf?: Fields) {
        this.db = new Database(DB_PATH);

        this.name = name;
        this.conf = (conf || DEFAULT) as Fields;

        // "name" and "conf" are subject to injections
        check(this.name);
        Object.entries(this.conf)
            .forEach(([k, v]) => { check(k); check(v); })
    }

    init() {
        const entries = Object.entries(this.conf)
            .map(([a, b]) => a + " " + b)
            .join(", ");

        this.db.prepare(`CREATE TABLE IF NOT EXISTS ${this.name} (${entries})`)
        .run();
    }

    select(...cols: Array<keyof Fields>): Entry[] {
        if(cols.length > 0) {
            const tar = "? ".repeat(cols.length);
            return this.db.prepare(`SELECT ${tar} FROM ${this.name}`)
                .all(cols) as Entry[];
        }
        return this.db.prepare(`SELECT * FROM ${this.name}`).all() as Entry[];
    }

    insert(dat: FieldArgs<Fields>): SQLite3.RunResult {
        const keys = Object.keys(dat);
        if( !keys.every(k => k in this.conf) )
            throw Error("A key does not exist in this table");

        const vals = Object.values(dat);
        const slots = makeSlots("?", keys.length);

        return this.db
            .prepare(`INSERT INTO ${this.name} (${keys.join(", ")}) VALUES (${slots})`)
            .run(vals);
    }

    update(id: number, dat: FieldArgs<Fields>): SQLite3.RunResult {
        const keys = Object.keys(dat);
        if( !keys.every(k => k in this.conf) )
            throw Error("A key does not exist in this table");

        const tars = keys
            .map(v => v + "= ?")
            .join(", ");

        const args = Object.values(dat);
        args.push(id);

        return this.db.prepare(`UPDATE ${this.name} SET ${tars} WHERE id = ?`)
            .run(args);
    }

    headers(): ColumnInfo[] {
        return this.db.pragma(`table_info(${this.name})`) as ColumnInfo[]
    }

    raw(): SQLite3.Database {
        return this.db;
    }
}