import { ColumnInfo, Entry } from "../utils/types/db";

function buildHead(headers: ColumnInfo[]): string {
    const cols = headers
        .filter(({ pk }) => !pk)
        .map(({ name }) => `<th>${name}</th>`)
        .join("\n");
    
    return (`
        <thead>
            <tr>${cols}</tr>
        </thead>
    `);
}

export type TableConfig = {
    headers: ColumnInfo[],
}
export default {
    build: (config: TableConfig) => {
        const { headers } = config;

        return (`
            <table id="datatable" class="table table-striped table-bordered" style="width:100%">
                ${buildHead(headers)}
            </table>
        `);
    },

    css: "",
    js: "",
}