import Vue from 'vue'

const state = {
    all: {},
    lastId: 0
};

const assertNewValidCategory= (state, name, code ) => {

    const assertNameValid = (value) => {
        if( typeof value !== 'string' || ! value.length  ) {
            throw new Error('A category name must be specified')
        }
    };

    const assertCodeUnique = (value) => {
        if( ! value ) {
            return;
        }

        const match = Object.values(state.all).find( (item) => {
            return item.code && item.code.toLowerCase() === value.toLowerCase();
        });

        if( match ) {
            throw new Error('That category code already exists')
        }
    };

    const assertNameUnique = (value) => {
        const match = Object.values(state.all).find( (item) => {
            return item.name && item.name.toLowerCase() === value.toLowerCase();
        });

        if( match ) {
            throw new Error('That category name already exists')
        }
    };

    assertNameValid(name);
    assertCodeUnique(code);
    assertNameUnique(name);
};

const getters = {
    ALL: state => Object.values(state.all),
    LAST_ADDED: state => state.all[state.lastId] || null,
    FIND_BY_ID: state => id => state.all[id] || null,
    FIND_BY_NAME: state => name => {
        return Object.values(state.all).find( cat => (cat.name && cat.name.toLowerCase()) === name.toLowerCase() )
    },
    TRANSACTIONS: (state, getters, rootState) => {
        return Object.values(rootState.transactions.all).reduce( (byCat, t) => {
            const catId = t.category || 'none';
            byCat[catId] = byCat[catId] || [];
            byCat[catId].push(t);
            return byCat;
        }, {})
    },
    DEBITS: (state, getters, rootState, rootGetters) => {
        return rootGetters["transactions/DEBITS"].reduce( (byCat, t) => {
            const catId = t.category || 'none';
            byCat[catId] = byCat[catId] || [];
            byCat[catId].push(t);
            return byCat;
        }, {})
    }
};

const mutations = {
    ADD: (state, { code, name }) => {
        assertNewValidCategory(state, name, code);
        const nextId = state.lastId +1;
        Vue.set(state.all, nextId, {
            id: nextId,
            code,
            name
        });
        state.lastId = nextId;
    }
};

const actions = {
    ADD: ({commit, getters}, { code, name } ) => {
        return new Promise((resolve, reject) => {
            try {
                commit('ADD', { code, name });
                resolve(getters.LAST_ADDED)
            }
            catch(e) {
                reject(e.message())
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