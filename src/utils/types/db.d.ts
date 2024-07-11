export type SchemaPreset = "transactions" | "products";

export type CellType = string | number
export type ColumnType = "DATE" | "REAL" | "INTEGER" | "TEXT" | "GLOB"

export type Entry = { [key: string]: CellType };
export type ColumnInfo = {
    cid: number,
    name: string,
    type: ColumnType,
    notnull: boolean,
    dflt_value: any,
    pk: boolean
}