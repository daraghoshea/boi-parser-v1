import {money} from "../../utils/money";
import Invoice from "./Invoice";

export default class InvoicesCollection {

    invoices;
    #byCustomer;

    constructor(invoices) {
        this.invoices = [];
        this.#byCustomer = {};
        invoices && invoices.forEach( i => this.addInvoice(i) );
    }

    get all() {
        return this.invoices;
    }

    get length() {
        return this.count;
    }

    get count() {
        return this.invoices.length;
    }

    get subtotal() {
        return this.invoices.reduce( (subtotal, inv) => {
            return subtotal.add(inv.subtotal)
        }, money())
    }

    get tax() {
        return this.invoices.reduce( (taxes, inv) => {
            return taxes.add(inv.tax)
        }, money())
    }

    get total() {
        return this.invoices.reduce( (total, inv) => {
            return total.add(inv.total)
        }, money())
    }

    addInvoice(data) {
        const invoice = data instanceof Invoice ? data : new Invoice(data);
        const contact = data.contact;
        this.invoices.push(invoice);

        this.#byCustomer[contact] = this.#byCustomer[contact] || []
        this.#byCustomer[contact].push(invoice)
    }


    forCustomer(customerId) {
        return new InvoicesCollection(
            this.#byCustomer[customerId]
        )
    }

    isEmpty() {
        return this.invoices.length === 0
    }

    loadContactsUsing( fetchContactsByIds ) {
        // collect list of ids
        const contactIds = this.invoices.reduce( (ids, inv) => {
            inv.data.contact && ids.push(inv.data.contact);
            return ids;
        }, []);

        // fetch contacts using fetch function
        // needs to be passed as param so can leverage vuex getters
        const contacts = fetchContactsByIds(contactIds);

        // update each invoice
        this.invoices = this.invoices.map( inv => {
            // Map returned, so `get` function called
            inv.contact = contacts[inv.data.contact] || null;
            return inv;
        })

        return this
    }


    groupBy(keyFn) {
        return Object.fromEntries(Array.from(this.all).reduce((map,t) => {
            const key = keyFn(t);
            const values = map.get(key) || [];
            values.push(t);
            map.set(key, values);
            return map
        }, new Map));
    }

    toJson() {
        return {
            items: this.invoices.map( i => i.toJson() ),
            subtotal: this.subtotal.toJSON(),
            tax: this.tax.toJSON(),
            total: this.total.toJSON()
        }
    }

    // TODO paid invoices, outstanding 30 days, etc

    // TODO paginate
}