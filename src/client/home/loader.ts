import $ from 'jquery';
import 'bootstrap';
import DTinit from './datatable'
import './btns';

import * as Modal from './modal';

$(async () => {
    const tbl = await DTinit();

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

    // Import Button
    $('#import-btn').on('click', () => {
        $('#import-btn-hidden').trigger('click');
    })

    $('#import-btn-hidden').on('input', async function() {
        const fd = new FormData();
        // @ts-ignore
        const file = $(this)[0].files[0];
        fd.append('file', file);

        try {
            await $.post({
                url: '/data/import',
                processData: false,
                contentType: false,
                data: fd
            });

            location.reload();
        }
        catch(err) {
            console.log("Import Failed", err)
        }

    })

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
                  .add( { id: parseInt(res), ...fields } )
                  .node()
                )
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