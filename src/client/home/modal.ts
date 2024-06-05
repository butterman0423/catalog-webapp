import $ from 'jquery';
import { Modal } from 'bootstrap';

type ModalData = {
    title: string,
    url: string,
    method: string,
    target?: HTMLElement
}

const inputSelector = 'input.form-input';

//$(...).modal('hide') causes .modal() is not function issue

export function getModal(): Modal {
    return Modal.getOrCreateInstance('#db-form-modal');
}

export function formatModal(dat: ModalData) {
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

export function readFields(): {[k: string]: any} {
    const fields: {[k: string]: any} = {};
    $(inputSelector)
    .each(function() {
        fields[$(this).prop('name') as string] = $(this).val();
    });
    return fields;
}

export function fillFields(selector: string) {
    const row = $(selector);
    const inputs = $('input.form-input');

    row.children('td:not(:first-child)')
    .each((i, el) => {
        $(inputs.get(i) as HTMLElement)
        .val($(el).text())
    });
}

export function toRow(selector: string) {
    const row = $(selector);
    const els = $(inputSelector);

    row.children("td:not(:first-child)")
    .each(function(i) {
        $(this).text( $(els.get(i) as HTMLElement).val() as string );
    });
}