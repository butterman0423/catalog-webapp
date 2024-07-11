export function parseSQL(code: string): string[] {
    return code.trim().split(";")               // ';' is the SQLite CLI delimeter
        .filter((v) => v.trim().length > 0);    // Remove any blank entries
}

export function makeSlots(pttn: string, amount: number): string {
    return pttn + `, ${pttn}`.repeat(amount - 1);
}