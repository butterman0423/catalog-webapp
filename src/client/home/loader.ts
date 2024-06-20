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
            const dat = tbl.row('', { selected: true }).data()
            Modal.formatModal({ target: dat, ...data });
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
            const uuid = await $.ajax({
                url: $(this).data('url'),
                method: $(this).data('method'),
                data: JSON.stringify(fields),
                processData: false,
                contentType: "application/json",
                dataType: "text"
            });

            if($(this).data('editing')) {
                Modal.toRow(tbl.row('', { selected : true }), fields);
                tbl.row('.selected').deselect();
            }
            else {
                $(tbl.row
                  .add( { uuid: uuid, ...fields } )
                  .node()
                )
                tbl.draw();
            }
            
            Modal.getModal().hide();
        } 
        catch(err) {
            const { responseText } = err as JQueryXHR;
            const res = JSON.parse(responseText)

            console.log("Request failed", res);
            Modal.writeFieldErrors(res);
        }

        $(this).removeClass('disabled');
    });

    // Filtering
    $('#dt-panes-submit').on('click', () => {
        const frags: string[] = []

        $('#dt-panes > .date-range').each(function() {
            const key = $(this).data('name');
            const vFrom = $(this).find(`input#${key}-from`).val();
            const vTo = $(this).find(`input#${key}-to`).val();

            if(!vFrom || !vTo)
                return;

            frags.push(`${key}[]=BETWEEN`);
            frags.push(`${key}[]=${vFrom}`);
            frags.push(`${key}[]=${vTo}`);
        });

        const qstr = frags.join("&");
        tbl.ajax.url(`/data?${qstr}`).load();
    });

    // Datetime buttons
    $('button.btn-time-local').on('click', function(e) {
        e.preventDefault();

        const target = $(this).data('loc-target');
        const datetime = new Date().toLocaleString('en-us', {
            timeZone: 'America/New_York',
            hour12: false,
            day: '2-digit',
            month: '2-digit',
            hour: '2-digit',
            minute: '2-digit',
            year: 'numeric'
        });

        const frags = datetime.match(/\d+/g);
        if(!frags || frags.length < 5)
            throw Error("Failed to get current datetime");

        const iso = `${frags[2]}-${frags[0]}-${frags[1]}T${frags[3]}:${frags[4]}`;
        $(this).parent()
            .find(`input[name=${target}]`)
            .val(iso)
    })
})