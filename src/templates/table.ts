import { ColumnInfo, Entry } from "../db";

function setTableAttrs(headers: ColumnInfo[]): string {
    const attrs = headers
        .map(({ name }, i) => `--data-col${i}="${name}"`)
        .join(" ");
    
    return (`--data-columns="${headers.length}" ${attrs}`);
}

function buildHead(headers: ColumnInfo[]): string {
    const cols = headers
        .map(({ name }) => `<th>${name}</th>`)
        .join("\n");
    
    return (`
        <thead>
            <tr>${cols}</tr>
        </thead>
    `);
}

function buildBody(data: Entry[], headers: ColumnInfo[]): string {
    const rows = data
        .map(dat => `
            <tr>
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
        <tbody>
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
            <table id="datatable" class="display" style="width:100%">
                ${buildHead(headers)}
                ${buildBody(data, headers)}
            </table>
        `);
    },

    css: "",
    js: "",
}