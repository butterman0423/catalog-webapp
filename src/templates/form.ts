import { ColumnInfo } from "../utils/types/db";

import DateTime from "./datetime";

function fill(headers: ColumnInfo[]) {
    return headers
        .filter( ({ pk, name }) => !pk && name !== 'uuid' )
        .map(({ name, notnull, type }) => {
            const isReq = notnull ? "required" : "";
            let itype;
            switch(type) {
                case "INTEGER":
                case "REAL":
                    itype = "number";
                    break;
                
                case "DATE":
                    return DateTime.build({ name, required: notnull })
                default:
                    itype = "text"
            }

            return (`
                <div class="mb-4 has-validation">
                    <label class="form-label ${isReq}" for="${name}">${name}</label>
                    <input 
                        class="form-control form-input" 
                        type="${itype}" 
                        name="${name}" 
                        ${isReq}
                    />
                </div>
                `);
            })
        .join("\n");
}

export type FormConfig = {
    headers: ColumnInfo[];
}
export default {
    build: (config: FormConfig) => {
        const { headers } = config;

        return (`
            <form id="db-add-form" action="/home/">
                ${fill(headers)}
            </form>
        `);
    },
}