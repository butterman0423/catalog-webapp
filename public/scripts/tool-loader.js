$(() => {
    $('#run-btn').on('click', () => {
        $('#run-btn').prop("disabled", true);

        $.get('/data/dev/', { code: $('#input').val() })
        .done((dat, status) => {
            console.log(dat);
            $('#output').text(dat);
        })
        .fail((xhr, status) => {
            
        })
        .always(() =>
            setTimeout(
                () => $('#run-btn').prop("disabled", false), 
                2000
            )
        );
    });
})