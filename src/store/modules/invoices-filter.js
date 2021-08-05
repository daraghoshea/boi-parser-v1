import {stringRegex} from "../../utils";
import {isString, isArray, includes, isDate} from 'lodash';
import moment from 'moment';
import Invoice from "../../components/invoices/Invoice";
import InvoicesCollection from "../../components/invoices/InvoicesCollection";

const stringRegexMatch = (string, filter) => {
    if( ! isString(filter) && ! filter.length ) {
        return true;
    }

    return !! string.match( stringRegex(filter) );
};

const sortValue = (invoice, key) => {
    switch(key) {
        case 'id':
            return invoice.id;

        case 'amount':
        case 'total':
            return (new Invoice(invoice)).total;

        case 'vat':
        case 'tax':
            return (new Invoice(invoice)).tax;

        case 'subtotal':
            return (new Invoice(invoice)).subtotal;

        case 'number':
            return invoice.data.number;

        case 'date':
        case 'due':
            return moment(invoice.data[key], moment.ISO_8601).unix();

        case 'updated':
            return moment(invoice.meta.updated, moment.ISO_8601).unix();

        case 'status':
            return invoice.status;
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

const amountFilter = (amountQuery) => {
    const compareType = ['lessThan', 'greaterThan', 'equalsTo'].reduce( (t, i) => t || amountQuery[i], null );

    return function(invoice) {
        const inv = new Invoice(invoice);
        switch(compareType) {
            case 'lessThan':
            case 'greaterThan':
            case 'equalsTo':
                return inv.total[compareType]( amountQuery[compareType] )
        }
        return invoice;
    }
};

const textFilter = (text, all = false) => {
    return function(invoice) {
        if( ! isString(text) || ! text.length) {
            return true;
        }

        const dateMatch = stringRegexMatch( invoice.data.date + "", text);
        const descMatch = stringRegexMatch( invoice.data.address + "", text);

        if( all ) {
            return dateMatch && descMatch;
        }

        return dateMatch || descMatch;
    }
}

export const queryFilterDefaults = {
    query: {
        text: '',
        categories: [],
        contacts: [],
        date: {
            from: null,
            to: null
        },
        due: {
            from: null,
            to: null
        },
        amount: {
            lessThan: null,
            greaterThan: null,
            equalsTo: null
        },
    },
    order: null,
    orderBy: null,
    deleted: null
};

export default class InvoicesFilter {

    options;
    invoices;

    constructor(invoices, options) {
        this.invoices = invoices;
        this.options = { ...queryFilterDefaults, ...options };
    }

    get filtered() {
        return this.invoices.filter( i => this.apply(i) )
            .sort( sortFn(this.options.orderBy, this.options.order) )
    }

    get collection() {
        return new InvoicesCollection(this.filtered);
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

    apply(i) {
        const filterAmount = amountFilter(this.options.query.amount);
        const filterText = textFilter(this.options.query.text);

        return this.filterContact(i)
            && filterText(i)
            && this.filterDeleted(i)
            && this.filterDate(i)
            && this.filterDue(i)
            && filterAmount(i)
    }

    sort(a,b) {
        const aV = sortValue(a, this.options.orderBy),
            bV = sortValue(b, this.options.orderBy);

        return this.options.order === 'desc' ? bV-aV : aV-bV;
    }

    filterDeleted(invoice) {
        if( this.options.deleted === 'exclude' ) {
            return ! invoice.meta.deleted;
        }
        if( this.options.deleted === 'only' ) {
            return !! invoice.meta.deleted;
        }
        return true;
    }

    filterContact(invoice) {
        if( !this.options.query.contacts || this.options.query.contacts === 'all' ) {
            return true;
        }
        if( this.options.query.contacts === 'none') {
            return ! invoice.contact;
        }
        if( isArray(this.options.query.contacts) ) {
            if( this.options.query.contacts.length ) {
                return includes(this.options.query.contacts, invoice.contact)
            }
            // Empty array, not being filtered
            return true;
        }
        throw new Error('Invalid filtering of transaction by contact');
    }

    filterDate(invoice) {
        const from = this.options.query.date.from,
              to = this.options.query.date.to;

        if( ! isDate(from) && ! isDate(to) ) {
            return true;
        }

        const invoiceDate = moment(invoice.data.date, moment.ISO_8601),
              validFrom = isDate(from) ? invoiceDate.isSameOrAfter(from) : true,
              validTo = isDate(to) ? invoiceDate.isSameOrBefore(to) : true;

        return validFrom && validTo;
    }

    filterDue(invoice) {
        const from = this.options.query.due.from,
            to = this.options.query.due.to;

        if( ! isDate(from) && ! isDate(to) ) {
            return true;
        }

        const invoiceDueDate = moment(invoice.data.due, moment.ISO_8601),
            validFrom = isDate(from) ? invoiceDueDate.isSameOrAfter(from) : true,
            validTo = isDate(to) ? invoiceDueDate.isSameOrBefore(to) : true;

        return validFrom && validTo;
    }
}