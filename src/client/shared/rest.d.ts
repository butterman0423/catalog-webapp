export declare function get<T,>(url: string): Promise<T>;
export declare function post<T,>(url: string, dat: T): Promise<PostResponse>;
export type PostResponse = {
    row: string,
    data: any
}