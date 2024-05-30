import { ColumnInfo } from "../db";

function fill(headers: ColumnInfo[]) {
    return headers
        .filter( ({ pk }) => !pk )
        .map(({ name }) => (`
            <div class="form-group container-fluid">
                <label class="col-sm-2" for="${name}">${name}</label>
                <input class="col-sm-10 form-input" name="${name}" type="text"/>
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
            <form class="form-horizontal" id="db-add-form" action="/home/">
                ${fill(headers)}
            </form>
        `);
    },
}