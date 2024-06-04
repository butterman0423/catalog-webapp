import $ from 'jquery';
import { Modal } from 'bootstrap';
import 'datatables.net-bs5';
import './btns';
import 'datatables.net-select-bs5';

type ModalData = {
    title: string,
    url: string,
    method: string,
    target?: HTMLElement
}

function formatModal(dat: ModalData) {
    const modal = $('#db-form-modal');
    let url = dat.url;

    if(dat.target) {
        const row = $(dat.target);
        url += row.data("pk");

        const inputs = $('input.form-input');
        row.children('td:not(:first-child)')
        .each((i, el) => {
            $(inputs.get(i) as HTMLElement)
            .val($(el).text())
        });
    }
    
    modal.find('.modal-title')
        .text(dat.title);
    
    modal.find('#db-form-submit')
        .data('url', url)
        .data('method', dat.method)
        .data('editing', dat.target !== undefined);
}

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
            formatModal({target: target, ...data});
            const modal = Modal.getOrCreateInstance('#db-form-modal');
            console.log(modal)
            modal.show();
        }
            
    });

    $('#add-btn').on('click', {
        title: "Add New Row",
        url: "/data/",
        method: "POST"
    }, ({ data }) => formatModal(data));

    // Modal form functionality
    $('#db-form-submit').on('click', async function() {
        $(this).addClass('disabled');

        const fields: {[k: string]: any} = {};
        $('input.form-input').each((_, el) => {
            const self = $(el);
            fields[(self.prop('name') as string)] = self.val();
        });

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
                const vals = Object.values(fields);
                $('.selected td:not(:first-child)')
                .each(function(i) {
                    $(this).text(vals[i]);
                })

                tbl.row('.selected').deselect();
            }
            else {
                $(  tbl.row
                    .add( [parseInt(res)].concat(Object.values(fields)) )
                    .node()
                ).data('pk', res);
                tbl.draw();
            }
            
            //$(...).modal('hide') causes .modal() is not function issue
            const modal = Modal.getOrCreateInstance('#db-form-modal');
            modal.hide();
        } 
        catch(err) {
            console.log("Request failed", err)
        }

        $(this).removeClass('disabled');
    });
})