import type { PostResponse } from "../shared/rest";

function _httpThrow(method: string, res: Response) {
    throw Error(`${method} failed on ${res.url}: ${res.status}, ${res.statusText}`)
}

async function get<T,>(url: string): Promise<T> {
    const res = await fetch(url);
    if(!res.ok) _httpThrow("GET", res);
    return res.json() as T;
}

async function post<T,>(url: string, dat: T): Promise<PostResponse> {
    const res = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(dat)
    });
    if(!res.ok) _httpThrow("POST", res);
    return {row: await res.text(), data: dat};
}