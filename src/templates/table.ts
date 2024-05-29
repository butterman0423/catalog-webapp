import { ColumnInfo, Entry } from "../db";

function setTableAttrs(headers: ColumnInfo[]): string {
    const attrs = headers
        .map(({ name }, i) => `--data-col${i}="${name}"`)
        .join(" ");
    
    return (`--data-columns="${headers.length}" ${attrs}`);
}

function buildHead(headers: ColumnInfo[]): string {
    const cols = headers
        .map(({ name }) => `<td class="tbl-cell">${name}</td>`)
        .join("\n");
    
    return (`
        <thead class="tbl-head">
            <tr class="tbl-row">${cols}</tr>
        </thead>
    `);
}

function buildBody(data: Entry[], headers: ColumnInfo[]): string {
    const rows = data
        .map(dat => `
            <tr class="tbl-row" --data-pk="${dat.id}">
                ${headers
                    .map(({ name }) => `
                        <td class="tbl-cell">${(name in dat) ? dat[name] : ""}</td>
                    `)
                    .join("\n")
                }
            </tr>
        `)
        .join("\n");
    
    return (`
        <tbody class="tbl-body">
            ${rows}
        </tbody>
    `);
}

export type TableConfig = {
    data: Entry[],
    headers: ColumnInfo[],
}
export default {
    build: (config: TableConfig) => {
        const { data, headers } = config;

        return (`
            <table class="table table-striped table-bordered" ${setTableAttrs(headers)}>
                ${buildHead(headers)}
                ${buildBody(data, headers)}
            </table>
        `);
    },

    css: "",
    js: "",
}