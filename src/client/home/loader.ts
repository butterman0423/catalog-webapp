import $ from 'jquery';
import 'datatables.net-bs5';
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
    $('#db-form-submit').on('click', () => {
        submitBtn.addClass('disabled');

        const fields: {[k: string]: any} = {};
        $('input.form-input').each((_, el) => {
            const self = $(el);
            fields[(self.prop('name') as string)] = self.val();
        });

        $.ajax(submitBtn.data('url'), {
            method: submitBtn.data('method'),
            data: JSON.stringify(fields),
            processData: false,
            contentType: "application/json",
            dataType: "text"
        })
        .done(id => {
            tbl.row
                .add( [parseInt(id)].concat(Object.values(fields)) )
                .draw();
            
            //$(...).modal('hide') causes .modal() is not function issue
            const modal = Modal.getInstance($('#db-form-modal').get(0) as HTMLElement) as Modal;
            modal.hide();
            
            $('input.form-input').each((_, el) => {
                const self = $(el);
                self.val("");
            });
        })
        .fail(() => console.log("Request failed"))
        .always(() => submitBtn.removeClass('disabled'));
    });
})