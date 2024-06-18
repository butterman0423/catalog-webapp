import Table from '../templates/table';
import Form from "../templates/form";
import Dropdown from "../templates/dropdown";
import Modal from "../templates/modal";
import type { ColumnInfo, Entry } from 'src/db';

export type HomePageConfig = {
    headers: ColumnInfo[]
}
export default {
    build: (opts: HomePageConfig) => {
        const { headers } = opts;
        
        return (`
        <div class="container">   
            <div class="row mb-3 mt-3">
                <div class="col-10 btn-toolbar">
                    ${Dropdown.build({ title: "TODO", items: [{href:"#", text:"test"}]})}

                    <div class="btn-group tbl-config">
                        <button class="btn btn-primary">New</button>
                        <button id="import-btn" class="btn btn-primary">Import</button>
                        <input id="import-btn-hidden" type="file" accept=".xlsx, .csv" style="display:none">
                    </div>
                </div>

                <div class="col-2" btn-toolbar">
                    <div class="btn-group float-end tbl-tooling">
                        <button id="edit-btn" class="btn btn-primary">
                            Edit
                        </button>
                        <button id="add-btn" class="btn btn-primary" data-bs-toggle="modal" data-bs-target="#db-form-modal">
                            Add
                        </button>
                    </div>
                </div>
            </div>

            <div id="dt-panes" class="row" hidden></div>
            
            <div class="tbl-container">
                ${Table.build({ headers: headers })}
            </div>

            ${ Modal.build({ title: "Add New Row", body: Form.build({ headers: headers }) }) }
        </div>
        `)
    }
}