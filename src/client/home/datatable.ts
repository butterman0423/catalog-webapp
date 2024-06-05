import $ from 'jquery';
import 'datatables.net-bs5';
import 'datatables.net-select-bs5';
import './btns';

export default function init() {
    const tbl = $('#datatable').DataTable({
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
    .every(function() {
        const col = this;
        const header = $(this.header());
        const title = header.text();

        header
        .append(`<input class="col-search" placeholder="Search ${title}" type="text"/>`)
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