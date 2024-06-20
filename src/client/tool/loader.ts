import 'bootstrap';
import $ from 'jquery';

import { createDT } from './datatable';

$(() => {
    $('#run-btn').on('click', async () => {
        $('#run-btn').prop("disabled", true);

        try {
            const res = await $.get('/data/dev/', { code: $('#input').val() });
            //$('#output').append(res);
            $('#output').empty()
            for(let i = 0; i < res.length; i++) {
                const qres = res[i];
                createDT(qres, $('#output'), i)
            }
        } 
        catch(err) {
            const jqxhr = err as JQueryXHR;
            console.log("Failed:", jqxhr.responseText);
            $('#output').text(jqxhr.responseText);
        }

        setTimeout(
            () => $('#run-btn').prop("disabled", false), 
            2000
        );
    });
});