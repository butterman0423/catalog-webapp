import type SQLite3 from 'better-sqlite3';
import Database from 'better-sqlite3';
import { join } from 'node:path'
import { randomUUID } from 'node:crypto';
import DEFAULT from 'default_tbl.json'

const DB_PATH = join(__dirname, "/data/data.db");

type ValType = string | number
type Config = { [key: string]: string };
type FieldArgs<T> = { [k in keyof T as Exclude<k, ['pk', 'uuid']>]: ValType }
type Selector<T> = {
    target: keyof T,
    op: '=' | 'LIKE' | 'BETWEEN',
    to: ValType | ValType[]
}

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
    private _headers: ColumnInfo[] | null;

    constructor(name: string, conf?: Fields) {
        this.db = new Database(DB_PATH);

        this.name = name;
        this.conf = (conf || DEFAULT) as Fields;
        this._headers = null;

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

    _select(...cols: Array<keyof Fields>): Entry[] {
        if(cols.length > 0) {
            const tar = "? ".repeat(cols.length);
            return this.db.prepare(`SELECT ${tar} FROM ${this.name}`)
                .all(cols) as Entry[];
        }
        return this.db.prepare(`SELECT * FROM ${this.name}`).all() as Entry[];
    }

    select(proj?: (keyof Fields)[] | 'all', sel?: Selector<Fields>[] | null, lim?: number, off?: number): Entry[] {
        const frags: string[] = [];
        const args: any[] = [];

        if(!proj || proj === 'all') {
            frags.push(`SELECT * FROM ${this.name}`)
        }
        else if(proj.length === 0) {
            return [];
        }
        else {
            const tar = "? ".repeat(proj.length);
            frags.push(`SELECT ${tar} FROM ${this.name}`);
            args.concat(proj);
        }

        if(sel && sel.length > 0) {
            frags.push("WHERE");
            const clauses = sel
                .map(({ target, op, to}) => {
                    check(target as string); 
                    check(op);

                    const tar = Array.isArray(to) ? '? '.repeat(to.length) : '?';
                    return `${target as string} ${op} ${tar}`
                })
                .join(" AND ");
            const subArgs = sel
                .map(({ to }) => to)
                .flat();
            
            frags.push(clauses);
            args.concat(subArgs);
        }

        if(lim) {
            frags.push(`LIMIT ${lim}`);
        }

        if(off) {
            frags.push(`OFFSET ${off}`)
        }

        const stmt = frags.join(' ');
        return this.db.prepare(stmt).all(args) as Entry[];
    }

    insert(dat: FieldArgs<Fields>): string {
        const id = randomUUID();
        const _dat = { uuid: id, ...dat };
        const keys = Object.keys(_dat);
        if( !keys.every(k => k in this.conf) )
            throw Error("A key does not exist in this table");

        const vals = Object.values(_dat);
        const slots = makeSlots("?", keys.length);

        this.db
        .prepare(`INSERT INTO ${this.name} (${keys.join(", ")}) VALUES (${slots})`)
        .run(vals);

        return id;
    }

    update(id: string, dat: FieldArgs<Fields>): SQLite3.RunResult {
        const keys = Object.keys(dat);
        if( !keys.every(k => k in this.conf) )
            throw Error("A key does not exist in this table");

        const tars = keys
            .map(v => v + "= ?")
            .join(", ");

        const args = Object.values(dat);
        args.push(id);

        return this.db.prepare(`UPDATE ${this.name} SET ${tars} WHERE uuid LIKE ?`)
            .run(args);
    }

    headers(): ColumnInfo[] {
        if(this._headers)
            return this._headers;

        this._headers = this.db.pragma(`table_info(${this.name})`) as ColumnInfo[];
        return this._headers;
    }

    raw(): SQLite3.Database {
        return this.db;
    }
}