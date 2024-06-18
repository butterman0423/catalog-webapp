import $ from 'jquery';
import DataTable from 'datatables.net-bs5';
import 'datatables.net-select-bs5';
import 'datatables.net-searchpanes-dt'
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
        scrollX: true,
        select: {
            style: 'single',
            items: 'row',
            info: false
        },
    });

    new DataTable.Buttons(tbl, [
        {
            name: "exports",
            extend: 'collection',
            text: 'Export',
            className: 'btn-primary',
            // @ts-expect-error
            buttons: ['csv', 'excel', 'print']
        },
        {
            name: 'filter-btn',
            text: 'Filter',
            className: 'btn-primary filter-btn',
            action: function() {
                const container = $('#dt-panes');
                container.prop('hidden', !container.prop('hidden'))
            }
        }
    ])

    new DataTable.SearchPanes(tbl, {
        
    })

    // Add Search Panes
    tbl.searchPanes.container().appendTo($('#dt-panes'));
    tbl.searchPanes.resizePanes()
    
    // Add export buttons
    tbl
    .buttons('exports:name')
    .container()
    .find('.btn:not(.filter-btn)')
    .removeClass('btn-secondary')
    .appendTo($('.tbl-config'));

    // Add filter button
    tbl
    .buttons('filter-btn:name')
    .container()
    .find('.filter-btn')
    .removeClass('btn-secondary')
    .prependTo($('.tbl-tooling'))

    // Add column search bars
    /*
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
    */

    return tbl;
}