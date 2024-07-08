import type { DB } from 'src/utils/db';
import type { Dict } from 'src/utils/types'

import { guessCSVConfig, getCSVHeaders, csvToJSON } from './parsers/csv-parser';
import { hasValidColumns, checkRow } from './checks/db-check';

export async function process(path: string, db: DB<any>) {
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
    