import moment from 'moment';

export function firstTransactionDate(transactions) {
    return Array.from(transactions).reduce( (earliest, transaction) => {
        const date = moment(transaction.data.date);
        earliest = earliest || moment(transaction.data.date);
        return date.isBefore( earliest ) ? date : earliest;
    }, null);
}

export function lastTransactionDate(transactions) {
    return Array.from(transactions).reduce( (earliest, transaction) => {
        const date = moment(transaction.data.date);
        earliest = earliest || moment(transaction.data.date);
        return date.isAfter( earliest ) ? date : earliest;
    }, null);
}