const locale: Intl.DateTimeFormatOptions = {
    timeZone: 'America/New_York',
    hour12: false,
    day: '2-digit',
    month: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    year: 'numeric'
}

export function dateToISO(date: Date | string): string {
    if(typeof date === 'string')
        date = new Date(date);

    if(date.toString() === 'Invalid Date')
        return '';

    const datetime = date.toLocaleString('en-us', locale);
    const frags = datetime.match(/\d+/g);
    if(!frags || frags.length < 5)
        return '';

    const iso = `${frags[2]}-${frags[0]}-${frags[1]}T${frags[3]}:${frags[4]}`;

    return iso;
}

export function isoToString(iso: string): string {
    const date = new Date(iso);
    if(date.toString() === 'Invalid Date')
        return '';

    return date.toLocaleString('en-us', { ...locale, hour12: true });
}