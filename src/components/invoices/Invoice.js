import {money} from '../../utils/money'

export default class Invoice {

    invoice;

    constructor(invoice) {
        this.invoice = invoice;
    }

    get id() {
        return this.invoice.id;
    }

    get lines() {
        return this.invoice.data.lines.map(line => {
            line.subtotal = money(line.price).multiply(line.quantity);
            line.taxAmount = money({
                amount: Math.round(
                    line.subtotal.getAmount() * (line.tax || 0) / 100
                )
            });
            return line;
        })
    }

    get data() {
        return this.invoice.data;
    }

    get customer() {
        return this.invoice.data.customer;
    }

    get status() {
        return this.invoice.status;
    }

    get meta() {
        return this.invoice.meta;
    }

    get subtotal() {
        // Use get function which transforms
        return this.lines.reduce( (subtotal, line) => {
            return subtotal.add(line.subtotal)
        }, money())
    }

    get tax() {
        return this.lines.reduce( (tax, line) => {
            return tax.add(line.taxAmount);
        }, money())
    }

    get total() {
        return this.subtotal.add(this.tax);
    }

    get contact() {
        return this.invoice.contact;
    }

    set contact(contact) {
        this.invoice.contact = contact;
    }

    toJson() {
        return {
            ...this.invoice,
            lines: this.lines,
            totals: {
                subtotal: this.subtotal.toJSON(),
                tax: this.tax.toJSON(),
                total: this.total.toJSON()
            }
        }
    }
}