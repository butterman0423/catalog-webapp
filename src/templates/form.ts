import { ColumnInfo } from "../db";

function fill(headers: ColumnInfo[]) {
    return headers
        .filter( ({ pk }) => !pk )
        .map(({ name }) => (`
            <div class="mb-4">
                <label class="form-label" for="${name}">${name}</label>
                <input class="form-control form-input" name="${name}" type="text"/>
            </div>
        `))
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