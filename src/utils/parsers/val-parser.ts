export function toRealFixed(v: any): string | null {
    if(typeof v !== 'number' && Number.isNaN(v=parseFloat(v)))
        return null
    return (v as number).toFixed(2);
}

export function toInt(v: any): number | null {
    if(typeof v === 'string')
        v = parseInt(v);

    if(!Number.isInteger(v))
        return null;
    return v;
}