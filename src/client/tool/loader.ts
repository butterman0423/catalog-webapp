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
            console.log("Failed")
        }

        setTimeout(
            () => $('#run-btn').prop("disabled", false), 
            2000
        );
    });
});