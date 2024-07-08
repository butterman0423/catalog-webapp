import { createReadStream } from 'fs';
import { createInterface } from 'readline/promises';
import csvConvert from 'convert-csv-to-json';

type CSVConfig = {
    delimiter: string,
    quoted: boolean
}

async function getLine(path: string): Promise<string> {
    // Stream to read lines
    const stream = createReadStream(path);
    const rl = createInterface({
        input: stream,
        crlfDelay: Infinity
    });
    const iter = rl[Symbol.asyncIterator]();

    return (await iter.next()).value;
}

// Guess what delimiter and "" file is may using
export async function guessCSVConfig(path: string): Promise<CSVConfig> {
    const line = await getLine(path);
    const matchRes = line.match(/[;\|,]/);
    if(!matchRes)
        throw Error("CSV delimeter not found");

    return {
        delimiter: matchRes[0],
        quoted: line.includes('"')
    }
}

export async function getCSVHeaders(path: string): Promise<string[] | null> {
    const line = await getLine(path);
    const matches = line.match(/[\w\s_]+/g);

    if(!matches)
        return null;
    return matches.map((v) => v); // ...and format
}

export function csvToJSON(path: string, conf: CSVConfig) {
    return csvConvert
        .fieldDelimiter(conf.delimiter)
        .supportQuotedField(conf.quoted)
        .formatValueByType(true)
        .getJsonFromCsv(path);
}