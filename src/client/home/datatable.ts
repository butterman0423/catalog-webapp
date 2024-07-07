import $ from 'jquery';
import DataTable from 'datatables.net-bs5';
import 'datatables.net-select-bs5';
import './btns';

import { isoToString } from 'src/utils/date-converter';

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
        .map(({ name, type }) => {
            return { 
                data: name,
                render: type === 'DATE' ? isoToString : undefined
            }
        })

    const tbl = $('#datatable').DataTable({
        ajax: "/data/",
        columns: cols,
        columnDefs: [
            {
                target: 0,
                searchable: false,
                orderable: false,
                visible: false
            }
        ],
        order: [[1, 'desc']],
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

    return tbl;
}