// @ts-nocheck

async function get<T,>(url: string): Promise<T> {
    const res = await fetch(url);
    if(!res.ok) throw new Error(`Fetch failed on ${url}: ${res.status}, ${res.statusText}`);
    return JSON.parse(await res.text()) as T;
}

