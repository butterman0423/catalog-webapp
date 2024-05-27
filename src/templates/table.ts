import db, { ColumnInfo, Entry } from "../db";

function setTableAttrs(headers: ColumnInfo[]): string {
    const attrs = headers
        .map(({ name }, i) => `--data-col${i}="${name}"`)
        .join(" ");
    
    return (`--data-columns="${headers.length}" ${attrs}`);
}

function buildHead(headers: ColumnInfo[]): string {
    const cols = headers
        .map(({ name }) => `<td>${name}</td>`)
        .join("\n");
    
    return (`
        <thead class="db-table-hd">
            <tr>${cols}</tr>
        </thead>
    `);
}

function buildBody(data: Entry[], headers: ColumnInfo[]): string {
    const rows = data
        .map(dat => `
            <tr --data-pk="${dat.id}">
                ${headers
                    .map(({ name }) => `
                        <td>${(name in dat) ? dat[name] : ""}</td>
                    `)
                    .join("\n")
                }
            </tr>
        `)
        .join("\n");
    
    return (`
        <tbody class="db-table-bdy">
            ${rows}
        </tbody>
    `);
}

export type TableOptions = {

}
export default {
    build: (_opts?: TableOptions) => {
        const qstmt = db.prepare("SELECT * FROM sample");
        
        const query = qstmt.all() as Entry[];
        const headers = (db.pragma("table_info(sample)") as ColumnInfo[])
            .filter(col => !col.pk)

        return (`
            <table class="db-table" ${setTableAttrs(headers)}>
                ${buildHead(headers)}
                ${buildBody(query, headers)}
            </table>
        `);
    },

    css: "",
    js: "",
}