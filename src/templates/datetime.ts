export type DateTimeOpts = {
    name: string,
    nameAttr?: string,
    required?: boolean
}

export default {
    build: (opts: DateTimeOpts) => {
        let { name, nameAttr, required } = opts;
        if(!nameAttr)
            nameAttr = name;
        const isReq = required ? "required" : "";

        return (`
        <div>
            <label for="${nameAttr}" class="form-label ${isReq}">${name}</label>
            <input 
                type="datetime-local" 
                name="${nameAttr}"
                class="form-control form-input"
            />
            <button class="btn btn-secondary btn-time-local" data-loc-target="${nameAttr}">Current Time</button>
        </div>
        `)
    }
}