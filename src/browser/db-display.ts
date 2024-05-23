import type { RowData } from "./types/db-fetch";

(async () => {
    const headRes = await fetch("/data/headers/");
    const headers = JSON.parse(await headRes.text()) as string[];

    const res = await fetch("/data/");
    const data = JSON.parse(await res.text()) as RowData[];
    
    const tblEl = document.createElement("table");

    data.forEach(row => {
        const rowEl = tblEl.insertRow();
        headers.forEach(key => rowEl.insertCell().append(`${row[key]}`));
    });

    document.body.appendChild(tblEl);
})();