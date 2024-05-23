// @ts-nocheck

import type { get } from "./shared/rest"

type RowData = {
    //id: number,
    dtype: string,
    datetime: string,
    [k: string]: string | number | undefined,
}

async function dbd_build(headers: string[], data: RowData[]) {
    const tblEl = document.createElement("table");

    data.forEach(row => {
        const rowEl = tblEl.insertRow();
        headers.forEach(key => rowEl.insertCell().append(`${row[key]}`));
    });

    document.body.appendChild(tblEl);
}

get<string[]>("/data/headers/")
.then( headers => Promise.all([headers, get<RowData[]>("/data/")]) )
.then( ([head, data]) => dbd_build(head, data))
.catch(msg => console.log(`Table creation failed: ${msg}`));