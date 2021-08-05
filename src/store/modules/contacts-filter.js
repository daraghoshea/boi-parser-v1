import {stringRegex} from "../../utils";
import {isArray, isString, includes} from 'lodash';

const stringRegexMatch = (string, filter) => {
    if( ! isString(filter) && ! filter.length ) {
        return true;
    }

    return !! string.match( stringRegex(filter) );
};

const sortValue = (value, key) => {
    switch(key) {
        case 'id':
            return value.id;

        case 'name':
        case 'company':
            return value.company.name + "";

        default:
            throw new Error('Invalid sort key for contacts')
    }
};

const sortFn = (orderBy, dir) => {
    return (a,b) => {
        const aV = sortValue(a, orderBy),
            bV = sortValue(b, orderBy);

        if(isString(aV)) {
            return dir === 'desc' ? bV.localeCompare(aV) : aV.localeCompare(bV);
        }

        return dir === 'desc' ? bV-aV : aV-bV;
    }
};

export const queryFilterDefaults = {
    search: '',
    order: null,
    orderBy: null,
    deleted: null,
    exclude: []
};

export default class ContactsFilter {

    #options;
    #collection;

    constructor(collection, options) {
        this.#collection = collection;
        this.#options = { ...queryFilterDefaults, ...options };
    }

    get filtered() {
        return this.#collection.filter( t => {
            return this.apply( t )
        }).sort( sortFn(this.#options.orderBy, this.#options.order) )
    }

    get count() {
        return this.filtered.length;
    }

    apply(t) {
        return this.filterAnyTextField(t, this.#options.search)
            && this.filterDeleted(t)
            && this.filterExclude(t);
    }

    filterDeleted(i) {
        if( this.#options.deleted === 'exclude' ) {
            return ! i.meta.deleted;
        }
        if( this.#options.deleted === 'only' ) {
            return !! i.meta.deleted;
        }
        return true;
    }

    filterAnyTextField(value, text) {
        if( ! isString(text) || ! text.length) {
            return true;
        }

        const companyMatch = stringRegexMatch( value.company.name + "", text);
        const peopleMatch = value.people.reduce( (isMatch, person) => {
            const nameMatch = stringRegexMatch(person.name, text),
                  emailMatch = stringRegexMatch(person.email + "", text)
            return isMatch && (nameMatch || emailMatch)
        }, false);

        return companyMatch || peopleMatch;
    }

    filterExclude(value) {
        if( ! isArray(this.#options.exclude) || ! this.#options.exclude.length ) {
            return true;
        }

        return ! includes(this.#options.exclude, value.id);
    }
}