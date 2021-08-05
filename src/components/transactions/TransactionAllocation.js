import {formatMoney, money} from "../../utils/money";

export default class TransactionAllocation {

    allocations;
    transaction;

    constructor(transaction, allocations) {
        this.transaction = transaction;
        this.allocations = allocations;
    }

    get transactionAmount() {
        return money(this.transaction.data.amount);
    }

    get allocationsTotal() {
        return this.allocations.reduce((total, a) => {
            return total.add(a.amount)
        }, money());
    }

    get remaining() {
        return this.transactionAmount.subtract(this.allocationsTotal);
    }

    get isFullyAllocated() {
        return this.allocationsTotal.equalsTo(this.transactionAmount);
    }

    assertValid() {
        if( this.allocationsTotal.greaterThan(this.transactionAmount) ) {
            throw new Error(`Cannot allocate ${formatMoney(this.allocationsTotal)} as more than transaction value of ${formatMoney(this.transactionAmount)}`)
        }
    }
}