export default {
    build: () => {
        return (`
        <div class="container vh-100">
            <h1>Tool Page</h1>
            <div class="row mb-3">
                <div class="col-12"
                    <span>To execute SQLite code, press Run.</span>
                    <button id="run-btn" class="btn btn-primary float-end">Run</button>
                </div>
            </div>

            <div class="font-monospace row h-75">
                <div class="col-6 h-100">
                    <div class="card h-100">
                        <div class="card-header">
                            SQLite Code
                        </div>
                        <textarea id="input" class="code-area p-4 w-100 h-100"></textarea>
                    </div>
                </div>

                <div class="col-6 h-100">
                    <div class="card h-100">
                        <div class="card-header">
                            Output
                        </div>
                        <div id="output" class="code-output p-4"></div>
                    </div>
                </div>
            </div>
        </div>
        `);
    }
}