export function isValidDate(date: Date | string): boolean {
    if(typeof date === 'string')
        date = new Date(date);

    return date.toString() !== 'Invalid Date';
}