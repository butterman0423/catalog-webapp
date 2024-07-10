export function parseSQL(code: string): string[] {
    return code.trim().split(";");      // ';' is the SQLite CLI delimeter
}

export function makeSlots(pttn: string, amount: number): string {
    return pttn + `, ${pttn}`.repeat(amount - 1);
}