const keys = ["bootstrap", "datatables", "myStyles"];

export type OmitTargets = {
    bootstrap?: boolean,
    datatables?: boolean,
    myStyles?: boolean,

    [k: string]: boolean | undefined
}

type Map = { [k: string]: string }

const cssMap = {
    bootstrap: `<link rel="stylesheet" href="/bootstrap/css/bootstrap.min.css"/>`,
    datatables: `<link rel="stylesheet" type="text/css" href="/datatables-bs5/css/dataTables.bootstrap5.min.css"/>`,
    myStyles: `<link rel="stylesheet" type="text/css" href="/styles/style.css"/>`
}

function paste(map: Map, omit: OmitTargets | undefined) {
    if(!omit) {
        return Object.values(map)
            .join("\n");
    }
    return keys
        .filter(k => !omit[k])
        .map(k => map[k])
        .join("\n");
}

export type HTMLConfig = {
    title: string
    body: string
    js: string
    omit?: OmitTargets
}
export default {
    build: (opts: HTMLConfig) => {
        const { title, body, js, omit } = opts;

        return (`
            <!DOCTYPE html>
            <html data-bs-theme="dark">
                <head>
                    <title>${title}</title>
                    ${paste(cssMap, omit)}
                </head>
                <body>
                    ${body} 
                    <script src=${js}></script>
                </body>
            </html>
        `);
    }
}