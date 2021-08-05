import Vue from 'vue'
import {isNumber, isString} from 'lodash'
import moment from "moment";

const state = {
    all: {},
    lastId: 0
};

function orderCollection( collection, key, dir ) {
    return collection.sort( (a,b) => {
        let aVal = a[key], bVal = b[key];
        if( isString(aVal) ) {
            aVal = aVal.toUpperCase()
        }
        if( isString(bVal) ) {
            bVal = bVal.toUpperCase()
        }
        return dir === 'desc'
            ? bVal - aVal
            : aVal - bVal
    });
}

function assertValidAccount(state, account) {
    if( ! isString(account.data.bankName) || ! account.data.bankName.length ) {
        throw new Error('Bank name cannot be empty')
    }
    if( ! isString(account.data.accountName) || ! account.data.accountName.length ) {
        throw new Error('Account name cannot be empty')
    }
    if( ! isString(account.data.accountCurrency) || ! account.data.accountCurrency.length ) {
        throw new Error('Account currency cannot be empty')
    }
}


const getters = {
    ALL: state => Object.values(state.all),
    GET: state => ({orderBy, order, limit, from} = {}) => {
        let accounts = Object.values(state.all);
        limit = isNumber(limit) ? limit : 0
        from = isNumber(from) ? from : 0

        // Order
        if( isString(orderBy) && orderBy && accounts.length && accounts[0].hasOwnProperty(orderBy) ) {
            order = order === 'desc' ? 'desc' : 'asc';
            accounts = orderCollection(accounts, orderBy, order)
        }

        if( limit ) {
            accounts = accounts.slice(from, limit)
        }
        return accounts;
    },
    FIND_BY_ID: state => id => state.all[id] || null,
    FIND_BY_IDS: state => ids => ids.map(id => state.all[id]),
    LAST_ID: state => state.lastId,
};

export const mutations = {
    ADD: (state, { account }) => {
        assertValidAccount(state, account);
        const nextId = state.lastId +1;
        Vue.set(state.all, nextId, {
            id: nextId,
            data: account.data,
            meta: {
                ...account.meta,
                _created: moment().toISOString()
            }
        });
        return state.lastId = nextId;
    },
    EDIT: (state, {id, account}) => {
        assertValidAccount(state, account);

        if( ! state.all[id] ) {
            throw new Error(`Could not find account to edit with id ${id}`)
        }

        Vue.set(state.all[id], 'data', account.data);
        Vue.set(state.all[id], 'meta', {
            ...state.all[id].meta,
            ...account.meta,
            _updated: moment().toISOString()
        })
    }
};

export const actions = {
    SAVE: ({ getters, commit}, {id, account} ) => {
        return new Promise((resolve, reject) => {
            try {
                if (!id) {
                    commit('ADD', { account });
                    resolve(getters.LAST_ID)
                } else {
                    commit('EDIT', {id, account});
                    resolve()
                }
            }
            catch(e) {
                reject(e.message);
            }
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