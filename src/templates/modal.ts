export type ModalConfig = {
    title: string,
    body: string,
}
export default {
    build: (opts: ModalConfig) => {
        const { title, body } = opts;

        return (`
            <div class="modal fade" id="db-form-modal" tab-index=-1>
                <div class="modal-dialog modal-dialog-scrollable">
                    <div class="modal-content">
                        <div class="modal-header">
                            <div class="row">
                                <h1 class="modal-title">${title}</h1>
                                <p class="db-form-target"></p>
                            </div>
                            
                            <button class="btn-close" data-bs-dismiss="modal"></button>
                        </div>
                        
                        <div class="modal-body px-4">
                            ${body}
                        </div>

                        <div class="modal-footer">
                            <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">
                                Cancel
                            </button>
                            <button type="button" id="db-form-submit" class="btn btn-primary">
                                Submit
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        `);
    }
}