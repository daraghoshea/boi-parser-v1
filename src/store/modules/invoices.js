import Vue from 'vue'
import moment from 'moment'
import {uniq} from "lodash";
import Invoice from "../../components/invoices/Invoice";
import InvoicesCollection from "../../components/invoices/InvoicesCollection";
import InvoicesFilter from "./invoices-filter";

const state = {
    all: {},
    lastId: 0,
    allocations: {}
};

export const statuses = {
    DRAFT: 'draft',
    SENT: 'sent',
    AWAITING: 'awaiting',
    PAID: 'paid'
};

function assertValidInvoiceData(model) {
    if( ! model.data.number ) {
        throw new Error(`An invoice number is required`)
    }
    // An empty contact only allowed if in draft
    if( ! model.data.contact && model.status !== statuses.DRAFT ) {
        throw new Error(`A contact is required f`)
    }

    // No lines only allowed if in draft
    if( ! model.data.lines || ! model.data.lines.length ) {
        if( model.status !== statuses.DRAFT ) {
            throw new Error(`Cannot send an invoice with no line items`);
        }
    }
}

function assertUniqueInvoiceNumber(state, number, id) {
    const match = Object.values(state.all).find( inv => inv.data.number === number );
    if( match ) {
        if( ! id || id !== match.id ) {
            throw new Error(`Invoice number ${number} already exists`)
        }
    }
}

function assertValidStatus(invoice, status) {
    const isValid = Object.values(statuses).indexOf(status) > -1;
    if( ! isValid ) {
        throw new Error(`Cannot change invoice to invalid status: ${status}`)
    }

    // Draft
    if( status === statuses.DRAFT ) {
        // Can't change back to draft
        if(invoice.status !== statuses.DRAFT ) {
            throw new Error(`Cannot change status back to ${statuses.DRAFT}`);
        }
    }

    // Sent
    // Awaiting
    // Paid
    if( ! invoice.data.contact ) {
        throw new Error(`A contact is required before changing to ${status}`);
    }
    if( ! invoice.data.lines || ! invoice.data.lines.length ) {
        throw new Error(`There are no lines added to the invoice yet.`);
    }
    invoice.data.lines.forEach( (line, index) => {
        if( ! line.description || ! (line.description + "").trim() ) {
            throw new Error(`Line ${index +1} is missing a description`);
        }
    })
}

function fetchInvoice(state, id) {
    const inv = state.all[id] || null;
    if( ! inv ) {
        throw new Error(`Could not find invoice to edit with id ${id}`)
    }
    return inv;
}

const getters = {
    /** @return Object **/
    ALL: state => (new InvoicesCollection( Object.values(state.all) )).toJson(),
    /** @return Function **/
    GET: (state, getters, rootState, rootGetters) => options => {
        const filter = new InvoicesFilter( Object.values(state.all), options);
        if(options.loadContacts === true) {
            filter.collection.loadContactsUsing(rootGetters['contacts/FIND_BY_ID'])
        }
        return filter.collection.toJson();
    },
    /** @return Object **/
    FIND_BY_ID: state => id => new Invoice(state.all[id] || null).toJson(),
    /** @return Object **/
    FIND_BY_IDS: state => ids => {
        return Object.fromEntries( uniq(ids).reduce( (map, id) => {
            return map.set(id, state.all[id] || null );
        }, new Map) );
    },
    FIND_BY_CONTACT_ID: state => id => {
        return (new InvoicesFilter(Object.values(state.all), {
            contacts: [id]
        })).collection.toJson();
    },
    LAST_ID: state => state.lastId,
    NEXT_ID: state => state.number,
    NEXT_NUMBER: state => {
        return Number.parseInt( Object.values(state.all).reduce((highest, i) => {
            const num = Number.parseInt(i.data.number);
            return highest > num ? highest : num;
        }, 1)) + 1;
    },
    STATUSES: () => statuses,
};

export const mutations = {
    ADD: (state, { invoice, meta }) => {
        const nextId = state.lastId +1;
        const model = {
            id: nextId,
            data: invoice,
            status: statuses.DRAFT,
            meta: {
                ...meta,
                created: moment().toISOString(),
                updated: moment().toISOString()
            }
        };

        assertValidInvoiceData(model);
        assertUniqueInvoiceNumber(state, invoice.number);

        Vue.set(state.all, nextId, model);
        state.lastId = nextId;
    },
    EDIT: (state, {id, invoice, meta}) => {
        const inv = fetchInvoice(state, id);

        // if changing invoice number
        if(inv.number !== invoice.number) {
            // Cannot change if not a draft
            if( inv.status !== statuses.DRAFT ) {
                throw new Error(`Cannot adjust the number of an invoice that is not in draft.`);
            }
            // Make sure still unique
            assertUniqueInvoiceNumber(state, invoice.number, id);
        }

        Vue.set( inv, 'data', invoice );
        Vue.set( inv, 'meta', {...meta, updated: moment().toISOString() });
    },
    SET_NUMBER: (state, number ) => {
        if( typeof number !== 'number' ) {
            throw new Error(`Invoice number is not a valid number: ${number}`)
        }
        state.number = number;
    },
    SET_STATUS: (state, {id, status}) => {
        const inv = fetchInvoice(state, id);
        assertValidStatus(inv, status);
        Vue.set( inv, 'status', status );
    },
    ALLOCATE_TRANSACTION: (state, {id, transaction, amount}) => {
        let transactions = { ...state.allocations[id] };
        transactions = transactions || {};
        transactions[transaction] = amount;
        Vue.set(state.allocations, id, transactions);
    }
};

export const actions = {
    SAVE: ({commit, state}, {id, invoice, meta} ) => {
        return new Promise( (resolve, reject) => {
            try {
                if(!id) {
                    commit('ADD', { invoice, meta });
                    resolve(state.lastId)
                }
                else {
                    commit('EDIT', {id, invoice, meta});
                    resolve(id)
                }
            }
            catch(e) {
                reject(e.message)
            }
        })
    },
    SET_STATUS: ({commit, state}, {id, status}) => {
        const invoice = fetchInvoice(state, id);
        assertValidStatus(invoice, status);
        return commit('SET_STATUS', {id, status})
    },
    ALLOCATE_TRANSACTION: ({commit}, {id, transaction, amount}) => {
        commit('ALLOCATE_TRANSACTION', {id, transaction, amount});
    }
};

export default {
    namespaced: true,
    state,
    actions,
    getters,
    mutations
};