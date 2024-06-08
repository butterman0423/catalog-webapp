import { ColumnInfo } from "../db";

function fill(headers: ColumnInfo[]) {
    return headers
        .filter( ({ pk }) => !pk )
        .map(({ name, notnull, type }) => {
            const isReq = notnull ? "required" : "";
            let itype;
            switch(type) {
                case "INTEGER":
                case "REAL":
                    itype = "number";
                    break;
                
                case "DATE":
                    itype = "date";
                    break;
                
                default:
                    itype = "text"
            }

            return (`
                <div class="mb-4">
                    <label class="form-label ${isReq}" for="${name}">${name}</label>
                    <input class="form-control form-input" type="${itype}" name="${name}" type="text"/>
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