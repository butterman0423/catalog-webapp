import { dateToISO } from "./date-converter";
import type { ColumnInfo } from "src/utils/types/db";

type VarRow = { [k: string]: any }
type Report = { passed: boolean, details: VarRow }

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
export function checkRow(input: VarRow, confs: ColumnInfo[]): Report {
    let passed = true;
    const details: VarRow = {};

    for(const conf of confs) {
        const { name, type, notnull } = conf;
        let val = input[name];
        const isEmpty = !val || val === '"';    // " is an empty value in csv-converter

        // Required check
        if(notnull && isEmpty) {
            passed = false;
            details[name] = 'Missing Value'
            continue;
        }

        if(!isEmpty) {
            // Type Check
            switch(type) {
                case 'DATE':
                    const date = new Date(val);
                    const iso = dateToISO(date);

                    if(!iso) {
                        passed = false;
                        details[name] = `Passed date is not valid: ${val}`;
                    }
                    else {
                        input[name] = iso;
                    }
                    break;
                case 'REAL':
                    if(typeof val !== 'number' && !(val=parseFloat(val))) {
                        passed = false;
                        details[name] = `Passed number is not valid: ${val}`;
                    }
                    else {
                        input[name] = (val as number).toFixed(2);
                    }
                    break;
                case 'INTEGER':
                    if(typeof val === 'string')
                        val = parseInt(val);

                    if(!Number.isInteger(val)) {
                        passed = false;
                        details[name] = `Passed integer is not valid: ${val}`;
                    }
                    break;
            }
        }
    }

    return { passed, details }
}