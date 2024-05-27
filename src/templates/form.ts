import { ColumnInfo } from "../db";

function fill(headers: ColumnInfo[]) {
    return headers
        .map(({ name }, i) => (`
            <label for="${name}">${name}</label>
            <input class="form-input" name="${name}" type="text"/>
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
                <input type="submit" name="submit" value="Submit"/>
                <button class="form-cancel">Cancel</button>
            </form>
        `);
    },
}