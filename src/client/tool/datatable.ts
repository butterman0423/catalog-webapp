import type { Api } from 'datatables.net-bs5';
import type JQuery from 'jquery'

import $ from 'jquery';
import 'datatables.net-bs5';

type TableData = { query: string, dat: any, cols: string[] }

function makeTemplate(cols: string[], idx: number) {
    return (`
    <table id="tbl-${idx}" class="table table-striped table-bordered">
        <thead>
            <tr>
                ${ cols.map((n) => `<th>${n}</th>`).join('\n') }
            </tr>
        </thead>
    </table>    
    `);
}

export function createDT(src: TableData, dest: JQuery<HTMLElement>, idx: number): Api<any> {
    const { query, dat, cols } = src
    dest.append(`
        <div>
            <p>${query}</p>
            ${ makeTemplate(cols, idx) }
        </div>    
    `);

    const dt = dest.find(`#tbl-${idx}`);
    return dt.DataTable({
        data: dat,
        columns: cols.map((_, i) => ({ data: i })),
        layout: {
            topStart: null,
            topEnd: 'search',
            bottomStart: null,
            bottomEnd: null
        },
    })
}