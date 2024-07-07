export type ValType = string | number
export type Entry = { [key: string]: ValType };
export type ColumnInfo = {
    cid: number,
    name: string,
    type: string,
    notnull: boolean,
    dflt_value: any,
    pk: boolean
}