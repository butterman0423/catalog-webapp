const keys = ["jquery", "bootstrap", "datatables", "myStyles"];

export type OmitTargets = {
    jquery?: boolean,
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

const jsMap = {
    jquery: `<script src="/jquery/jquery.min.js"></script>`,
    bootstrap: `<script src="/bootstrap/js/bootstrap.bundle.min.js"></script>`,
    datatables: `<script src="/datatables/dataTables.min.js"></script>
    <script src="/datatables-bs5/js/dataTables.bootstrap5.js"></script>`,
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
    omit?: OmitTargets
}
export default {
    build: (opts: HTMLConfig) => {
        const { title, body, omit } = opts;

        return (`
            <!DOCTYPE html>
            <html data-bs-theme="dark">
                <head>
                    <title>${title}</title>
                    ${paste(cssMap, omit)}
                </head>
                <body>
                    ${body}
                    
                    ${paste(jsMap, omit)}
                    <script src="/scripts/home-loader.js"></script>
                </body>
            </html>
        `);
    }
}