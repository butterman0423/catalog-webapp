import type SQLite3 from 'better-sqlite3';
import type { ColumnInfo, Entry, CellType, SchemaPreset } from './types/db';

import Database from 'better-sqlite3';
import { join } from 'node:path'
import { randomUUID } from 'node:crypto';
import { checkInjection } from './checks/db-check';
import { makeSlots } from './parsers/db-parser';

import Schema from 'schema.json'

const check = checkInjection;       // Lazy to rename all check() calls
const DB_PATH = join(__dirname, "/data/data.db");

type Config = { [key: string]: string };
type FieldArgs<T> = { [k in keyof T as Exclude<k, ['pk', 'uuid']>]: CellType }
type Selector<T> = {
    target: keyof T,
    op: '=' | 'LIKE' | 'BETWEEN',
    to: CellType | CellType[]
}

export class DB<Fields extends Config> {
    db: SQLite3.Database
    conf: Fields
    name: string
    private _headers: ColumnInfo[] | null

    static makeAll(path: string): void {
        for(const key in Schema) {
            const db = new DB(key, key as SchemaPreset, path);
            db.init();
            db.close();
        }
    }

    constructor(name: string, conf: Fields | SchemaPreset, path: string = DB_PATH) {
        this.db = new Database(path);

        this.name = name;

        if(typeof conf === 'string') {
            conf = (Schema[conf] as unknown) as Fields;
        }
        this.conf = conf;
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
    
    select(proj?: (keyof Fields)[] | 'all', sel?: Selector<Fields>[] | null, lim?: number, off?: number): Entry[] {
        const frags: string[] = [];
        let args: any[] = [];

        if(!proj || proj === 'all') {
            frags.push(`SELECT * FROM ${this.name}`)
        }
        else if(proj.length === 0) {
            return [];
        }
        else {
            const tar = "? ".repeat(proj.length);
            frags.push(`SELECT ${tar} FROM ${this.name}`);
            args = args.concat(proj);
        }

        if(sel && sel.length > 0) {
            frags.push("WHERE");
            const clauses = sel
                .map(({ target, op, to}) => {
                    check(target as string); 
                    check(op);

                    const tar = Array.isArray(to) ? to.map(() => '?').join(' AND ') : '?';
                    return `${target as string} ${op} ${tar}`
                })
                .join(" AND ");
            const subArgs = sel
                .map(({ to }) => to)
                .flat();
            
            frags.push(clauses);
            args = args.concat(subArgs);
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

    close(): void {
        this.db.close();
    }

    raw(): SQLite3.Database {
        return this.db;
    }
}