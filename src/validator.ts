import type { ColumnInfo } from "./db";
import moment from 'moment'

type VarRow = { [k: string]: any }

// Valid CSV file
// - Matching Column Names
export async function checkCSVColumns(inputs: string[], headers: string[]) {
    // Existent 'pk' check
    if(inputs.includes('pk'))
        throw Error("CSV columns includes 'pk'")

    // Duplicate check
    for(let i = 0; i < inputs.length - 1; i++) {
        for(let j = i + 1; j < inputs.length; j++) {
            if(inputs[i] === inputs[j])
                throw Error(`CSV columns contains duplicates: ${inputs[i]}, ${inputs[j]}`)
        }
    }

    // Inclusion check
    if( !headers.every((v) => inputs.includes(v)) )
        throw Error("Some required columns are missing")
}

// Cell Type Validation
// - string ? DATE
// - number ? REAL (two decimal places)
// - NON NULL Fields
export function checkRow(input: VarRow, confs: ColumnInfo[]) {
    for(const conf of confs) {
        const { name, type, notnull } = conf;
        const val = input[name];

        if(notnull) {
            // Required check
            // " is an empty value apparently
            if(!val || val === '"')
                throw Error(`A required field is null in column ${name}`)

            // Type Check
            switch(type) {
                case 'DATE':
                    // TODO: Support other formats and convert to this one (if possible)
                    if(!moment(val, 'YYYY-MM-DD', true).isValid())
                        throw Error(`DATE entry is not valid: ${val}`)
                    break;
                case 'REAL':
                    if(typeof val !== 'number')
                        throw Error(`REAL entry is not valid: ${val}`)
                    input[name] = (val as number).toFixed(2);
                    break;
                case 'INTEGER':
                    if(!Number.isInteger(val))
                        throw Error(`INTEGER entry is not valid: ${val}`)
                    break;
            }
        }
    }

    return true;
}