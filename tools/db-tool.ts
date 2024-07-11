/**
 * This is a tooling script meant to manage this SQLite Database
 */

import { join } from 'node:path';
import { rm } from 'node:fs/promises';
import { createInterface } from 'node:readline/promises';
import { exit, argv } from 'node:process';

import { execSQL } from '../src/utils/processor';
import { DB } from '../src/utils/db'

function printHelp() {
    return (
        "npm run tool -- <option> [option...]\n" +
        "  -R --reset  : Recreates data.db with schema.json tables and rebuilds project.\n" +
        "  -e --edit   : Run SQLite statements on data.db\n" +
        "  -b --backup : Create a backup for data.db.\n" +
        "  -h --help   : Display this help message."
    );
}

function parseArgs() {
    let flags = {
        R: false,
        e: false,
        b: false,
        h: false,
        _fail: argv.length <= 2,
        _fail_reason: 'No arguments were given.',
    }

    for(let i = 2; i < argv.length; i++) {
        const arg = argv[i];
        switch(arg) {
            case '-R':
            case '--reset':
                flags.R = true;
                break;
            case '-e':
            case '--edit':
                flags.e = true;
                break;
            case '-b':
            case '--backup':
                flags.b = true;
                break;
            case '-h':
            case '--help':
                flags.h = true;
                break;
            default:
                flags._fail = true;
                flags._fail_reason = `Unrecognized flag '${arg}'.`;
                break;
        }
    }

    return flags;
}


// ------------------ MAIN --------------------- //

async function main() {
    const DB_PATH = join(__dirname, "../..", "/data/data.db");
    console.log(DB_PATH)
    const flags = parseArgs();
    const { _fail, _fail_reason } = flags;
    
    if(_fail) {
        console.error(_fail_reason, printHelp());

        if(!flags.R && !flags.e && !flags.b && !flags.h) {
            console.error(
                "\n***npm run <script> -- <args...> syntax is bugged on powershell.",
                "If this was run with powershell rerun using cmd.exe."
            );
        }

        exit(1);
    }

    if(flags.h) {
        console.log(printHelp());
        exit(0);
    }

    if(flags.R) {
        await rm(DB_PATH, { force: true });
        DB.makeAll(DB_PATH);
    }

    if(flags.b) {
        console.log("Starting backup");

        const db = new DB('', {}, DB_PATH);
        const path = join(__dirname, "../../data", `backup-${Date.now()}.db`);
        await db.raw().backup(path);
        db.close();

        console.log("Backup created at ", path);
    }

    if(flags.e) {
        const rl = createInterface(process.stdin);
        const sql: string[] = [];

        rl.on('line', async function (line) {
            if(line.charCodeAt(0) === 4) {
                rl.close(); // EOF signal
            } else {
                sql.push(line);
            }
        });
        rl.on('close', async () => {
            const code = sql.join(' ');
            const db = new DB('', {}, DB_PATH);
            await execSQL(db, code);    // TODO: Print output

            console.log("Finished executing");

            db.close();
            exit(0);
        });

        console.log("SQLite Executor: Press CTRL+D and Enter to execute code; CTRL+C to abort.");
    }
    else {
        exit(0);
    }

}

main()
