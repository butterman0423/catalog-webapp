import DateTime from './datetime';

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
                ${ DateTime.build({ name: 'From', nameAttr: `${name}-from` }) }
                ${ DateTime.build({ name: 'To', nameAttr: `${name}-to` }) }
            </div>
        </div>
        `);
    }
}