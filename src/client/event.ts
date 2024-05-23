import type { post } from "./shared/rest"
import type { addRow } from "./shared/build-table"

async function sendRow() {
    const tblEl = document.querySelector<HTMLTableElement>(".db-table");
    if(!tblEl) throw Error("Database table not found.");
    
    const tmpData = {dtype: "text", data: "Hello World!"};

    // @ts-ignore
    const res = await post("/data/", {dtype: "text", data: "Hello World!"});

    // @ts-ignore
    addRow(tblEl, {id: res.row, ...tmpData});
}