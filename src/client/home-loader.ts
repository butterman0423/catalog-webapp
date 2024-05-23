// @ts-nocheck

import type { get } from "./shared/rest"
import type { RandomRowData, createTable, addRow } from "./shared/build-table";

type RowData = {
    id: number,
    dtype: string,
    datetime: string,
    [k: string]: string | number | undefined,
}

(async () => {
    const headers = await get<string[]>("/data/headers/");
    const data = await get<RowData[]>("/data/");

    const root = document.querySelector(".app-container");

    // @ts-ignore
    const tblEl = createTable(root, headers);
    data.forEach(dat => addRow(tblEl, dat as RandomRowData));
})();