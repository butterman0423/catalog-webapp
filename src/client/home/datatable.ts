import $ from 'jquery';
import 'datatables.net-bs5';
import 'datatables.net-select-bs5';
import './btns';

type Columns = {
    name: string,
    type: string,
    notnull: boolean,
    pk: boolean
}

async function fetchHeaders(): Promise<Columns[]> {
    return $.ajax("/data/headers");
}

export default async function init() {
    const heads = await fetchHeaders();
    const cols = heads
        .map(({ name }) => ({ data: name }))

    const tbl = $('#datatable').DataTable({
        ajax: "/data/",
        columns: cols,
        order: [0, 'desc'],
        buttons: [
            {
                name: "exports",
                extend: 'collection',
                text: 'Export',
                className: 'btn-primary',
                // @ts-expect-error
                buttons: ['csv', 'excel', 'print']
            }
        ],
        select: {
            style: 'single',
            items: 'row',
            info: false
        },
    });

    // Add export buttons
    tbl
    .buttons('exports:name')
    .container()
    .find('.btn')
    .removeClass('btn-secondary')
    .appendTo($('.tbl-config'));

    // Add column search bars
    tbl
    .columns()
    .every(function(i) {
        const col = this;
        const header = $(this.header());
        const title = header.text();

        let type;
        switch(heads[i].type) {
            case "INTEGER":
            case "REAL":
                type = "number";
                break;
            
            case "DATE":
                type = "date";
                break;
            
            default:
                type = "text"
        }

        header
        .append(`<input class="col-search" type="${type}"placeholder="Search ${title}" type="text"/>`)
        .find("input")
        .on('keyup', function(e) {
            if (col.search() !== this.value) {
                col.search(this.value).draw();
            }
        })
        .on('click', e => e.stopPropagation());
    })

    return tbl;
}