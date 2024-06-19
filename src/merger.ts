import { createReadStream } from 'fs';
import { createInterface } from 'readline/promises';
import csvConvert from 'convert-csv-to-json';

import type { DB } from './db';
import { checkCSVColumns, checkRow } from './validator';

type CSVConfig = {
    delimiter: string,
    quoted: boolean
}
type VarMap = { [key: string]: any }

// Guess what delimiter and "" file is may using
function guessCSVConfig(line: string): CSVConfig {
    const matchRes = line.match(/[;\|,]/);
    if(!matchRes)
        throw Error("CSV delimeter not found");

    return {
        delimiter: matchRes[0],
        quoted: line.includes('"')
    }
}

export async function process(path: string, db: DB<any>) {
    const headers = db.headers()
        .filter(({ pk }) => !pk)

    const stream = createReadStream(path);
    const rl = createInterface({
        input: stream,
        crlfDelay: Infinity
    });
    const iter = rl[Symbol.asyncIterator]();

    // Validate
    let conf: CSVConfig;
    const line: string = (await iter.next()).value;

    const reqs = headers.map( ({ name }) => name );
    const matches = line.match(/[\w\s_]+/g);

    if(!matches)
        throw Error("Failed to parse column headers");

    const inputs = matches.map((v) => v);

    checkCSVColumns(inputs, reqs)
    conf = guessCSVConfig(line);

    const json = csvConvert
        .fieldDelimiter(conf.delimiter)
        .supportQuotedField(true)
        .formatValueByType(true)
        .getJsonFromCsv(path);

    json.forEach(v => checkRow(v, headers));

    // Push to DB
    const merge = db.raw().transaction((items: VarMap[]) => {
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
    