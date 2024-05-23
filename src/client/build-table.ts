import type { RandomRowData } from "./shared/build-table";

function createTable(root: HTMLElement, headers: Array<string>): HTMLTableElement {
    const tblEl = document.createElement("table");
    tblEl.setAttribute("class", "db-table");

    tblEl.setAttribute("data-columns", `${headers.length}`);
    headers.forEach((name, i) => tblEl.setAttribute(`data-col${i}`, name));

    // Attach column names
    const head = tblEl.createTHead().insertRow();
    headers.forEach(name => head.insertCell().innerText = name);

    tblEl.createTBody();

    root.appendChild(tblEl);
    return tblEl;
}

function addRow(tblEl: HTMLTableElement, data: RandomRowData) {
    const cells = parseInt(tblEl.getAttribute("data-columns") as string);
    const row = tblEl.tBodies[0].insertRow();

    for(let _t = 0; _t < cells; _t++)
        row.insertCell();

    row.setAttribute("data-key", data.id);
    updateRow(tblEl, parseInt(data.id), data, row);
}

function updateRow(tblEl: HTMLTableElement, idx: number, changes: RandomRowData, row?: HTMLTableRowElement) {
    if(!row)
        row = getRow(tblEl, idx);

    const headers = getHeaders(tblEl);
    headers.forEach((name, i) => {
        if(name in changes) {
            const cell = row.cells.item(i) as HTMLElement;
            cell.innerText = changes[name];
        }
    });
}

function deleteRow(tblEl: HTMLTableElement, idx: number) {
    const row = getRow(tblEl, idx);
    row.remove();
}

function wipe(tblEl: HTMLTableElement) {
    const headers = getHeaders(tblEl);
    const parent = tblEl.parentElement as HTMLElement;
    tblEl.remove();
    createTable(parent, headers);
}

function getHeaders(tblEl: HTMLTableElement): Array<string> {
    const n = parseInt(tblEl.dataset.columns as string);
    const headers: Array<string> = [];

    for(let i = 0; i < n; i++)
        headers.push(tblEl.getAttribute(`data-col${i}`) as string);

    return headers;
}

function getRow(tblEl: HTMLTableElement, idx: number): HTMLTableRowElement {
    const row = tblEl.querySelector<HTMLTableRowElement>(`tr[data-key="${idx}"]`);
    if(!row) throw Error(`Row with key ${idx} does not exists`);
    return row;
}