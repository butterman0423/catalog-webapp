export type ModalConfig = {
    title: string,
    body: string,
}
export default {
    build: (opts: ModalConfig) => {
        const { title, body } = opts;

        return (`
            <div class="modal fade" id="db-form-modal" tab-index=-1>
                <div class="modal-dialog">
                    <div class="modal-content">
                        <div class="modal-header">
                            <button type="button" class="close" data-dismiss="modal">
                                <span aria-hidden="true">&times;</span>
                            </button>
                            <h1 class="modal-title">${title}</h1>
                        </div>
                        
                        <div class="modal-body">
                            ${body}
                        </div>

                        <div class="modal-footer">
                            <button type="button" class="btn btn-default" data-dismiss="modal">
                                Cancel
                            </button>
                            <button type="button" class="btn btn-primary">
                                Submit
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        `);
    }
}