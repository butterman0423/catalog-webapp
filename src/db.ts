import Database from 'better-sqlite3';
import { join } from 'node:path'

const db = new Database(join(__dirname, "data/sample.db"));

export default db;
export const init = () => {
    // CONFIGURATION SUBJECT TO CHANGE //
    db.prepare(`DROP TABLE IF EXISTS sample`).run();
    db.prepare(`CREATE TABLE IF NOT EXISTS sample (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        dtype TEXT NOT NULL,
        data TEXT)`
    ).run();

    const insert = db.prepare(`INSERT INTO sample (dtype, data) VALUES (?, ?)`)

    insert.run("number", "1");
    insert.run("text", "hello");
    insert.run("datetime", "05212024:15:11:00");
}
export type Entry = { id: number, [key: string]: any}
export type ColumnInfo = {
    cid: number,
    name: string,
    type: string,
    notnull: boolean,
    dflt_value: any,
    pk: boolean
}