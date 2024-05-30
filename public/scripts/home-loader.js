function formatModal(ev) {
    const modal = $('#db-form-modal');
    
    modal.find('.modal-title')
        .text(ev.data.title);
    
    modal.find('#db-form-submit')
        .data('url', ev.data.url)
        .data('method', ev.data.method);
}

$(async () => {

    // Initialize table look
    $('#datatable').DataTable();

    // Add/Edit functionality
    // $('#edit-btn').on('click', {}, formatModal);
    $('#add-btn').on('click', {
        title: "Add New Row (TEST)",
        url: "/",
        method: "POST"
        // target: number   Row pk to yank data from
    }, formatModal);

    // Modal form functionality
})