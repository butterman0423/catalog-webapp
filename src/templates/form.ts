import { ColumnInfo } from "../db";

function fill(headers: ColumnInfo[]) {
    return headers
        .map(({ name }, i) => (`
            <div class="form-group">
                <label class="col-md-2" for="${name}">${name}</label>
                <input class="col-md-10 form-input" name="${name}" type="text"/>
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
                <div class="form-group">
                    <input class="btn btn-default btn-sm" type="submit" name="submit" value="Submit"/>
                    <button class="btn btn-default btn-sm form-cancel">Cancel</button>
                </div>
            </form>
        `);
    },
}