import type { RowData } from "./types/db-fetch";

async function dbd_fetch<T>(url: string): Promise<T> {
    const res = await fetch(url);
    if(!res.ok) throw new Error(`Fetch failed on ${url}: ${res.status}, ${res.statusText}`);
    return JSON.parse(await res.text()) as T;
}

async function dbd_build(headers: string[], data: RowData[]) {
    const tblEl = document.createElement("table");

    data.forEach(row => {
        const rowEl = tblEl.insertRow();
        headers.forEach(key => rowEl.insertCell().append(`${row[key]}`));
    });

    document.body.appendChild(tblEl);
}

dbd_fetch<string[]>("/data/headers/")
.then( headers => Promise.all([headers, dbd_fetch<RowData[]>("/data/")]) )
.then( ([head, data, ..._]) => dbd_build(head, data))
.catch(msg => console.log(`Table creation failed: ${msg}`));