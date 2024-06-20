export type DateRangeOpts = {
    name: string
}

export default {
    build: (opts: DateRangeOpts) => {
        const { name } = opts;

        return (`
        <div class="date-range col-4" data-name="${name}">
            <span>${name} : </span>
            <div>
                <label for="${name}-from">From</label>
                <input id="${name}-from" type="date" name="${name}-from"/>
                <label for="${name}-to">To</label>
                <input id="${name}-to" type="date" name="${name}-to"/>
            </div>
        </div>
        `);
    }
}