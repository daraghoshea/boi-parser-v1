import {stringRegex} from "../../utils";
import {formatMoney} from "../../utils/money";
import {isString, isArray, includes, isDate} from 'lodash';
import moment from 'moment';

const stringRegexMatch = (string, filter) => {
    if( ! isString(filter) && ! filter.length ) {
        return true;
    }

    return !! string.match( stringRegex(filter) );
};

const filterAmount = (amount, filter) => {
    if( ! filter  ) {
        return true;
    }

    const filterAmount = isString(filter) ? Number.parseFloat(filter) : filter;

    if( (filterAmount + "") !== filter.replace(/\.$/, '') ) {
        return false;
    }

    // Do a string compare, closest to user expectation
    return stringRegexMatch( formatMoney(amount), filterAmount + "" );
};

const sortValue = (transaction, key) => {
    switch(key) {
        case 'id':
            return transaction.id;

        case 'date':
            return moment(transaction.data.date, moment.ISO_8601).unix();

        case 'value':
            return transaction.data.value.amount;

        case 'description':
        case 'data.description':
            return transaction.data.description;
    }
};

const sortFn = (orderBy, dir) => {
    return (a,b) => {
        const aV = sortValue(a, orderBy),
            bV = sortValue(b, orderBy);

        if( isString(aV) ) {
            return dir === 'desc' ? bV.localeCompare(aV) : aV.localeCompare(bV);
        }

        return dir === 'desc' ? bV-aV : aV-bV;
    }
};

export const queryFilterDefaults = {
    query: {
        text: '',
        description: '',
        note: '',
        amount: '',
        categories: [],
        contacts: [],
        dates: {
            from: null,
            to: null
        },
        hasTax: false,
        limit: 100,
    },
    order: null,
    orderBy: null,
    type: null,
    deleted: null,
    month: null,
    accountId: null,
    fileId: null
};

export default class TransactionsFilter {

    #options;
    #transactions;

    constructor(transactions, options) {
        this.#transactions = transactions;
        this.#options = { ...queryFilterDefaults, ...options };

        if(this.#options.hasTax === true) {
            console.log(this.#options) /* eslint-disable-line */
        }
    }

    get filtered() {
        return this.#transactions.filter( t => {
            return this.apply( t )
        }).sort( sortFn(this.#options.orderBy, this.#options.order) )
    }

    get count() {
        return this.filtered.length;
    }

    get earliestDate() {
        const first = Array.from(this.filtered).sort( sortFn('date', 'asc') ).shift();
        return first && first.data.date;
    }

    get latestDate() {
        const last = Array.from(this.filtered).sort( sortFn('date', 'desc') ).shift();
        return last && last.data.date;
    }

    groupBy(keyFn) {
        return Object.fromEntries(Array.from(this.filtered).reduce((map,t) => {
            const key = keyFn(t);
            const values = map.get(key) || [];
            values.push(t);
            map.set(key, values);
            return map
        }, new Map));
    }

    apply(t) {
        return this.applyAdvanced(t);
    }

    applyAdvanced(t) {
        return this.filterType(t)
            && this.filterAccount(t)
            && this.filterFile(t)
            && this.filterCategory(t)
            && this.filterContact(t)
            && this.filterAnyTextField(t, this.#options.query.text)
            && this.filterMonth(t)
            && this.filterDeleted(t)
            && this.filterDates(t)
            && this.filterTax(t);
    }

    sort(a,b) {
        const aV = sortValue(a, this.#options.orderBy),
            bV = sortValue(b, this.#options.orderBy);

        return this.#options.order === 'desc' ? bV-aV : aV-bV;
    }

    filterDeleted(transaction) {
        if( this.#options.deleted === 'exclude' ) {
            return ! transaction.meta.deleted;
        }
        if( this.#options.deleted === 'only' ) {
            return !! transaction.meta.deleted;
        }
        return true;
    }

    filterMonth(transaction) {
        if( ! this.#options.month ) {
            return true;
        }
        const startOf = moment(this.#options.month, 'YYYY-MM-DD').startOf('month');
        const endOf = startOf.clone().endOf('month');
        const transactionDate = moment(transaction.data.date, moment.ISO_8601);

        return transactionDate.isSameOrAfter(startOf)
            && transactionDate.isSameOrBefore(endOf);
    }

    filterType(transaction) {
        return this.#options.type
            ? transaction.data.type === this.#options.type
            : true;
    }

    filterTax(transaction) {
        return this.#options.query.hasTax
            ? transaction.tax?.amount > 0
            : true;
    }

    filterCategory(transaction) {
        if( !this.#options.query.categories || this.#options.query.categories === 'all' ) {
            return true;
        }
        if( this.#options.query.categories === 'none') {
            return ! transaction.category;
        }
        if( isArray(this.#options.query.categories) ) {
            if( this.#options.query.categories.length ) {
                return includes(this.#options.query.categories, transaction.category)
            }
            // Empty array, not being filtered
            return true;
        }
        throw new Error('Invalid filtering of transaction by category');
    }

    filterContact(transaction) {
        if( !this.#options.query.contacts || this.#options.query.contacts === 'all' ) {
            return true;
        }
        if( this.#options.query.contacts === 'none') {
            return ! transaction.contact;
        }
        if( isArray(this.#options.query.contacts) ) {
            if( this.#options.query.contacts.length ) {
                return includes(this.#options.query.contacts, transaction.contact)
            }
            // Empty array, not being filtered
            return true;
        }
        throw new Error('Invalid filtering of transaction by contact');
    }

    filterAccount(transaction) {
        if( ! this.#options.accountId ) {
            return true;
        }
        return transaction.meta.accountId === this.#options.accountId;
    }

    filterFile(transaction) {
        if( ! this.#options.fileId ) {
            return true;
        }
        return transaction.meta.fileId === this.#options.fileId;
    }

    filterAnyTextField(transaction, text, all = false) {
        if( ! isString(text) || ! text.length) {
            return true;
        }

        const dateMatch = stringRegexMatch( transaction.data.date + "", text);
        const descMatch = stringRegexMatch( transaction.data.desc + "", text);
        const noteMatch = stringRegexMatch( transaction.data.note + "", text);
        const amountMatch = filterAmount( transaction.data.value, text );

        if( all ) {
            return dateMatch && descMatch && noteMatch && amountMatch;
        }

        return dateMatch || descMatch || noteMatch || amountMatch;
    }

    filterDates(transaction) {
        const from = this.#options.query.dates.from,
              to = this.#options.query.dates.to;

        if( ! isDate(from) && ! isDate(to) ) {
            return true;
        }

        const transactionDate = moment(transaction.data.date, moment.ISO_8601),
              validFrom = isDate(from) ? transactionDate.isSameOrAfter(from) : true,
              validTo = isDate(to) ? transactionDate.isSameOrBefore(to) : true;

        return validFrom && validTo;
    }
}