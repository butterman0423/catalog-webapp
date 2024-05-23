export type RandomRowData = { id: string, [key: string]: string };
export declare function createTable(root: HTMLElement, headers: Array<string>): HTMLTableElement;
export declare function addRow(tblEl: HTMLTableElement, data: RandomRowData): void;
export declare function updateRow(tblEl: HTMLTableElement, idx: number, changes: RandomRowData, row?: HTMLTableRowElement): void;
export declare function deleteRow(tblEl: HTMLTableElement, idx: number): void;
export declare function wipe(tblEl: HTMLTableElement): void;
export declare function getHeaders(tblEl: HTMLTableElement): Array<string>;
export declare function getRow(tblEl: HTMLTableElement, idx: number): HTMLTableRowElement;