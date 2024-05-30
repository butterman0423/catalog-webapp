import Table from '../templates/table';
import Form from "../templates/form";
import Dropdown from "../templates/dropdown";
import Modal from "../templates/modal";
import type { ColumnInfo, Entry } from 'src/db';

export type HomePageConfig = {
    headers: ColumnInfo[]
    query: Entry[]
}
export default {
    build: (opts: HomePageConfig) => {
        const { headers, query } = opts;
        
        return (`
        <div class="container">   
            <div class="row mb-3 mt-3">
                <div class="col-10 btn-toolbar">
                    ${Dropdown.build({ title: "TODO", items: [{href:"#", text:"test"}]})}

                    <div class="btn-group">
                        <button class="btn btn-primary">New</button>
                        <button class="btn btn-primary">Import</button>
                        <button class="btn btn-primary">Export</button>
                    </div>
                </div>

                <div class="col-2" btn-toolbar">
                    <div class="btn-group float-end">
                        <button id="edit-btn" class="btn btn-primary">
                            Edit
                        </button>
                        <button id="add-btn" class="btn btn-primary" data-bs-toggle="modal" data-bs-target="#db-form-modal">
                            Add
                        </button>
                    </div>
                </div>
            </div>
            
            <div class="tbl-container">
                ${Table.build({ data: query, headers: headers })}
            </div>

            ${ Modal.build({ title: "Add New Row", body: Form.build({ headers: headers }) }) }
        </div>
        `)
    }
}