function makeMenu(items: DropItem[]) {
    const tabs = items
        .map(({ href, text }) => `
            <li>
                <a class="dropdown-item" href="${href}">${text}</a>
            </li>
        `)
        .join("\n");

    return (`
        <ul class="dropdown-menu">
            ${tabs}
        </ul>
    `);
}

export type DropItem = {
    href: string,
    text: string,
}
export type DropConfig = {
    title: string,
    items: DropItem[],
}
export default {
    build: (opts: DropConfig) => {
        const { title, items } = opts
        return (`
            <div class="btn-group">
                <button class="btn btn-primary dropdown-toggle me-2" type="button" data-bs-toggle="dropdown">
                    ${title}
                </button>

                ${makeMenu(items)}
            </div>
        `);
    }
}