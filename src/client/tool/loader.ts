import 'bootstrap';
import $ from 'jquery';

$(() => {
    $('#run-btn').on('click', async () => {
        $('#run-btn').prop("disabled", true);

        try {
            const res = await $.get('/data/dev/', { code: $('#input').val() });
            $('#output').text(res);
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