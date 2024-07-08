import type { ColumnInfo } from "../types/db";
import type { Dict } from "../types";

import { dateToISO } from "../parsers/date-parser";
import { toRealFixed, toInt } from "../parsers/val-parser";

type Report = { passed: boolean, details: Dict }

// Valid CSV file
// - Matching Column Names
export async function hasValidColumns(inputs: string[], headers: string[]): Promise<boolean> {
    // Existent 'pk' check
    if(inputs.includes('pk')) {
        console.log("Columns includes 'pk'")
        return false;
    }

    // Duplicate check
    for(let i = 0; i < inputs.length - 1; i++) {
        for(let j = i + 1; j < inputs.length; j++) {
            if(inputs[i] === inputs[j]) {
                console.log(`Columns contains duplicates: ${inputs[i]}, ${inputs[j]}`);
                return false;
            }
        }
    }

    // Inclusion check
    if( !headers.every((v) => inputs.includes(v)) ) {
        console.log("Some required columns are missing");
        return false;
    }
    return true;
}

// Cell Type Validation
// - string ? DATE
// - number ? REAL (two decimal places)
// - NON NULL Fields
export function checkRow(input: Dict, confs: ColumnInfo[]): Report {
    let passed = true;
    const details: Dict = {};

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
            let v: any;
            // Type Check
            switch(type) {
                case 'DATE':
                    const iso = dateToISO(val);
                    if(iso === '') {
                        passed = false;
                        details[name] = `Passed date is not valid: ${val}`;
                        break;
                    }
                    input[name] = iso;
                    break;
                case 'REAL':
                    v = toRealFixed(val);
                    if(!v) {
                        passed = false;
                        details[name] = `Passed number is not valid: ${val}`;
                        break;
                    }
                    input[name] = v;
                    break;
                case 'INTEGER':
                    v = toInt(val);
                    if(!v) {
                        passed = false;
                        details[name] = `Passed integer is not valid: ${val}`;
                    }
                    break;
            }
        }
    }

    return { passed, details }
}