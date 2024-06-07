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