import {parseDate} from '../../utils'
import {sumAmounts, isMoney} from "../../utils/money";
import {uniq} from 'lodash'
import moment from 'moment'
import Vue from 'vue'
import TransactionsFilter from './transactions-filter'
import TransactionAllocation from "../../components/transactions/TransactionAllocation";
import {money} from "../../utils/money";

const state = {
    all: {},
    lastId: 0,
    allocations: {}
};

const types = {
    DEBIT: 'dr',
    CREDIT: 'cr'
};


/** @throws Error **/
const sanitizeAndAssertValidTransactionData = (t) => {
    // Description
    t.desc = t.desc + "";
    if( ! t.desc || ! t.desc.trim().length ) {
        throw new Error(`Transaction must contain a description`)
    }

    // Type
    if( ! t.type || Object.values(types).indexOf(t.type) < 0 ) {
        throw new Error(`Invalid transaction type. Must be one of '${types.DEBIT}' or '${types.CREDIT}'`)
    }

    // Date
    t.date = parseDate(t.date);
    if( ! t.date ) {
        throw new Error(`Invalid transaction date provided: ${t.date}`);
    }

    // Amount
    if( ! isMoney(t.value) ) {
        try {
            t.value = money(t.value);
        }
        catch(e) {
            throw new Error(`Error with transaction value: ${e.message}`);
        }
    }

    return t;
};

const getters = {
    ALL: state => Object.values(state.all),
    QUERY: state => options => {
        const filter = new TransactionsFilter( Object.values(state.all), {
            orderBy: 'date',
            order: 'desc',
            ...options
        });
        return filter.filtered;
    },
    FIND_BY_ID: state => id => state.all[id] || null,
    DEBITS: state => {
        const filter = new TransactionsFilter( Object.values(state.all), {
            type: 'dr',
            orderBy: 'date',
            order: 'desc'
        });
        return filter.filtered;
    },
    DEBITS_MONTHS: state => {
        const filter = new TransactionsFilter( Object.values(state.all), {
            type: 'dr',
            orderBy: 'date',
            order: 'desc'
        });

        return Object.keys(
            filter.groupBy(d => {
                return moment(d.data.date, moment.ISO_8601).format('YYYY-MM-01')
            })
        );
    },
    DEBITS_SUM: state => {
        const filter = new TransactionsFilter( Object.values(state.all), {
            type: 'dr'
        });
        return sumAmounts( filter.filtered.map( d => d.data.value ) );
    },
    DEBITS_COUNT: state => {
        const filter = new TransactionsFilter( Object.values(state.all), {
            type: 'dr'
        });
        return filter.count;
    },
    DEBITS_EARLIEST_DATE: state => {
        const filter = new TransactionsFilter( Object.values(state.all), {
            type: 'dr'
        });
        return filter.earliestDate;
    },
    DEBITS_LATEST_DATE: state => {
        const filter = new TransactionsFilter( Object.values(state.all), {
            type: 'dr'
        });
        return filter.latestDate;
    },
    CREDITS: state => {
        const filter = new TransactionsFilter( Object.values(state.all), {
            type: 'cr',
            orderBy: 'date',
            order: 'desc'
        });
        return filter.filtered;
    },
    CREDITS_SUM: state => {
        const filter = new TransactionsFilter( Object.values(state.all), {
            type: 'cr'
        });
        return sumAmounts( filter.filtered.map( d => d.data.value ) );
    },
    CREDITS_MONTHS: state => {
        const filter = new TransactionsFilter( Object.values(state.all), {
            type: 'cr',
            orderBy: 'date',
            order: 'desc'
        });
        return Object.keys(
            filter.groupBy(t => {
                return moment(t.data.date, moment.ISO_8601).format('YYYY-MM-01')
            })
        );
    },
    CREDITS_COUNT: state => {
        const filter = new TransactionsFilter( Object.values(state.all), {
            type: 'cr'
        });
        return filter.count;
    },
    CREDITS_EARLIEST_DATE: state => {
        const filter = new TransactionsFilter( Object.values(state.all), {
            type: 'cr'
        });
        return filter.earliestDate;
    },
    CREDITS_LATEST_DATE: state => {
        const filter = new TransactionsFilter( Object.values(state.all), {
            type: 'cr'
        });
        return filter.latestDate;
    },
    GET_FILE: (state) => (id) => {
        const filter = new TransactionsFilter( Object.values(state.all), {fileId: id});
        return filter.filtered;
    },
    GET_FILE_COUNT: (state) => (id) => {
        const filter = new TransactionsFilter( Object.values(state.all), {fileId: id});
        return filter.filtered.length;
    },
    ALLOCATED_INVOICES: (state, getters, rootState, rootGetters) => (id) => {
        const alloctions = state.allocations[id] || [];
        const ids = uniq(alloctions.map(a => a.invoice));
        if( ! ids.length ) {
            return [];
        }
        return rootGetters.invoices.findByIds(ids);
    }
};

export const mutations = {
    ADD: (state, { transaction, meta }) => {
        const nextId = state.lastId +1;

        transaction = sanitizeAndAssertValidTransactionData(transaction);

        Vue.set(state.all, nextId, {
            id: nextId,
            data: transaction,
            category: null,
            meta: {
                ...meta,
                updated: (new Date).toISOString(),
                created: (new Date).toISOString()
            }
        });

        state.lastId = nextId;
    },
    SET_CATEGORY: (state, { id, category }) => {
        const transaction = state.all[id] || null;
        transaction && Vue.set(transaction, 'category', category );
        transaction && Vue.set(transaction.meta, 'updated', (new Date).toISOString())
    },
    SET_CONTACT: (state, { id, contact }) => {
        const transaction = state.all[id] || null;
        transaction && Vue.set(transaction, 'contact', contact );
        transaction && Vue.set(transaction.meta, 'updated', (new Date).toISOString())
    },
    DELETE_CATEGORY: (state, {id}) => {
        const transaction = state.all[id] || null;
        transaction && Vue.set(transaction, 'category', null );
        transaction && Vue.set(transaction.meta, 'updated', (new Date).toISOString())
    },
    SET_EXPENSE: (state, {id, value}) => {
        const transaction = state.all[id] || null;
        transaction && Vue.set(transaction.data, 'expense', value );
        transaction && Vue.set(transaction.meta, 'updated', (new Date).toISOString())
    },
    SET_NOTE: (state, {id, note}) => {
        const transaction = state.all[id] || null;
        transaction && Vue.set(transaction.data, 'note', note);
        transaction && Vue.set(transaction.meta, 'updated', (new Date).toISOString())
    },
    ALLOCATE: (state, {id, allocations}) => {
        const transaction = state.all[id] || null;
        const transactionAllocation = new TransactionAllocation(transaction, allocations);
        transactionAllocation.assertValid();
        Vue.set(transaction, 'allocations', allocations);
        Vue.set(state.allocations, id, allocations);
    }
};

const actions = {
    ADD_MULTIPLE: ({commit}, { transactions, meta  }) => {
        transactions.forEach( transaction => {
            commit('ADD', { transaction, meta })
        })
    },
    SET_CATEGORY: ({commit}, { id, category }) => {
        return commit('SET_CATEGORY', { id, category })
    },
    SET_EXPENSE: ({commit}, {id, value}) => {
        return commit('SET_EXPENSE', {id, value});
    },
    SET_NOTE: ({commit}, {id, note}) => {
        return commit('SET_NOTE', {id, note});
    },
    SET_CONTACT: ({commit}, { id, contact }) => {
        return commit('SET_CONTACT', { id, contact })
    },
    ALLOCATE: ({commit, dispatch}, {id, allocations}) => {
        commit('ALLOCATE', {id, allocations});
        allocations.forEach(a => {
            dispatch('invoices/ALLOCATE_TRANSACTION', {
                id: a.invoice,
                transaction: id,
                amount: a.amount
            }, {root: true});
        })

    }
};

export default {
    namespaced: true,
    state,
    actions,
    getters,
    mutations
};