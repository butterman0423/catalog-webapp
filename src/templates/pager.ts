import Dropdown from "./dropdown";

export type PagerConfig = {

}
export default {
    build: (opts: PagerConfig) => {
        // Figure out how to include a dropdown page selector
        return (`
            <nav>
                <div class="btn-group">
                    <a href="#" class="btn btn-default"><span aria-hidden="true">&laquo;</span></a>
                    ${Dropdown.build({ title: "TODO", items: ["test"], noCaret: true})}
                    <a href="#" class="btn btn-default"><span aria-hidden="true">&raquo;</span></a>
                </div>
            </nav>
        `);
    }
}