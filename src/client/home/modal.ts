import $ from 'jquery';
import { Modal } from 'bootstrap';
import type { ApiRowMethods } from 'datatables.net-bs5';

type RowData = { [k: string]: any }
type ModalData = {
    title: string,
    url: string,
    method: string,
    target?: RowData
}

const inputSelector = '#db-form-modal input.form-input';

//$(...).modal('hide') causes .modal() is not function issue

export function getModal(): Modal {
    return Modal.getOrCreateInstance('#db-form-modal');
}

export function formatModal(dat: ModalData) {
    const modal = $('#db-form-modal');
    let url = dat.url;

    $(inputSelector).each(function() {
        const tar = $(this).parent();
        tar.removeClass('failed-input');
        $(this).removeClass('is-invalid')
        tar.val('');
    })

    if(dat.target) {
        url += dat.target['uuid'];

        modal.find('.db-form-target')
            .show()
            .text(dat.target['uuid']);

        fillFields(dat.target);
    }
    else {
        modal.find('.db-form-target').hide();
    }
    
    modal.find('.modal-title')
        .text(dat.title);
    
    modal.find('#db-form-submit')
        .data('url', url)
        .data('method', dat.method)
        .data('editing', dat.target !== undefined);
}

export function readFields(): {[k: string]: any} {
    const fields: {[k: string]: any} = {};
    $(inputSelector)
    .each(function() {
        fields[$(this).prop('name') as string] = $(this).val();
    });
    return fields;
}

export function fillFields(dat: RowData) {
    const inputs = $(inputSelector);
    inputs.each(function() {
        const name = $(this).prop("name");
        $(this).val(dat[name]);
    });
}

export function writeFieldErrors(json: { [k: string]: string }) {
    $(inputSelector).each(function() {
        const name = $(this).prop('name') as string;
        const tar = $(this).parent();
        if(name in json) {
            tar.attr('data-fail-reason', json[name]);
            tar.addClass('failed-input');
            $(this).addClass('is-invalid')
        }
        else {
            tar.removeClass('failed-input')
            $(this).removeClass('is-invalid')
        }
    })
}

export function toRow(row: ApiRowMethods<any>, newDat: RowData) {
    const dat = row.data();
    for(const key in newDat) {
        dat[key] = newDat[key];
    }

    row.data(dat);
}