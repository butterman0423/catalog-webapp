import $ from 'jquery';
import 'bootstrap';
import 'datatables.net-bs5';
import 'datatables.net-select-bs5';
import './btns';

import * as Modal from './modal';

$(async () => {
    // Initialize table look
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
        }
    });

    tbl
    .buttons('exports:name')
    .container()
    .find('.btn')
    .removeClass('btn-secondary')
    .appendTo($('.tbl-config'));

    // Add/Edit functionality
    $('#edit-btn').on('click', {
        title: "Edit Existing Row",
        url: "/data/",
        method: "PUT",
    }, ({ data }) => {
        const target = $('#datatable .selected').get(0);
        if(!target) {
            alert("Please Select a Row to Edit.")
        }
        else {
            Modal.formatModal({target: target, ...data});
            Modal.getModal().show();
        }
            
    });

    $('#add-btn').on('click', {
        title: "Add New Row",
        url: "/data/",
        method: "POST"
    }, ({ data }) => Modal.formatModal(data));

    // Modal form functionality
    $('#db-form-submit').on('click', async function() {
        $(this).addClass('disabled');
        const fields = Modal.readFields();

        try {
            const res = await $.ajax({
                url: $(this).data('url'),
                method: $(this).data('method'),
                data: JSON.stringify(fields),
                processData: false,
                contentType: "application/json",
                dataType: "text"
            });

            if($(this).data('editing')) {
                Modal.toRow('.selected');
                tbl.row('.selected').deselect();
            }
            else {
                $(tbl.row
                  .add( [parseInt(res)].concat(Object.values(fields)) )
                  .node()
                ).data('pk', res);
                tbl.draw();
            }
            
            Modal.getModal().hide();
        } 
        catch(err) {
            console.log("Request failed", err)
        }

        $(this).removeClass('disabled');
    });
})