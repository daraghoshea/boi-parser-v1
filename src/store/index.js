import Vue from 'vue'
import Vuex from 'vuex'
import VuexPersist from 'vuex-persist'

import accounts from './modules/accounts'
import app from './modules/app'
import categories from './modules/categories'
import contacts from './modules/contacts'
import files from './modules/files'
import invoices from './modules/invoices'
import processor from './modules/processor'
import statements from './modules/statements'
import transactions from './modules/transactions'

const vuexPersist = new VuexPersist({
    // key: 'boi-parser',
    key: 'test2',
    storage: window.localStorage
});

Vue.use(Vuex);

export default new Vuex.Store({
    modules: {
        accounts,
        app,
        categories,
        contacts,
        files,
        invoices,
        processor,
        statements,
        transactions,
    },
    plugins: [vuexPersist.plugin]
})