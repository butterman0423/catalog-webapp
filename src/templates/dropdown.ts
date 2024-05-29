function makeMenu(items: string[]) {
    const tabs = items
        .map(item => `<li>${item}</li>`)
        .join("\n");

    return (`
        <ul class="dropdown-menu">
            ${tabs}
        </ul>
    `);
}

export type DropConfig = {
    title: string,
    items: string[],

    noCaret?: boolean,
}
export default {
    build: (opts: DropConfig) => {
        const { title, items, noCaret } = opts
        return (`
            <div class="btn-group">
                <button class="btn btn-default dropdown-toggle" type="button" data-toggle="dropdown">
                    <span>${title}</span>
                    ${noCaret ? "" : `<span class="caret"></span>`}
                </button>

                ${makeMenu(items)}
            </div>
        `);
    }
}