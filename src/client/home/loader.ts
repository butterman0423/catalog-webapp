import $ from 'jquery';
import 'datatables.net-bs5';
import 'datatables.net-buttons-bs5';
import 'datatables.net-select-bs5';
import { Modal } from 'bootstrap';

function formatModal(ev: JQuery.ClickEvent) {
    const modal = $('#db-form-modal');
    
    modal.find('.modal-title')
        .text(ev.data.title);
    
    modal.find('#db-form-submit')
        .data('url', ev.data.url)
        .data('method', ev.data.method);
}

$(async () => {
    
    // Initialize table look
    const tbl = $('#datatable').DataTable({
        order: [0, 'desc']
    });

    // Add/Edit functionality
    // $('#edit-btn').on('click', {}, formatModal);
    $('#add-btn').on('click', {
        title: "Add New Row (TEST)",
        url: "/data/",
        method: "POST"
        // target: number   Row pk to yank data from
    }, formatModal);

    // Modal form functionality
    const submitBtn = $('#db-form-submit')
    $('#db-form-submit').on('click', async () => {
        submitBtn.addClass('disabled');

        const fields: {[k: string]: any} = {};
        $('input.form-input').each((_, el) => {
            const self = $(el);
            fields[(self.prop('name') as string)] = self.val();
        });

        try {
            const pkStr = await $.ajax({
                url: submitBtn.data('url'),
                method: submitBtn.data('method'),
                data: JSON.stringify(fields),
                processData: false,
                contentType: "application/json",
                dataType: "text"
            });

            tbl.row
                .add( [parseInt(pkStr)].concat(Object.values(fields)) )
                .draw();
            
            //$(...).modal('hide') causes .modal() is not function issue
            const modal = Modal.getInstance($('#db-form-modal').get(0) as HTMLElement) as Modal;
            modal.hide();
        } 
        catch(err) {
            console.log("Request failed", err)
        }

        submitBtn.removeClass('disabled');
    });
})