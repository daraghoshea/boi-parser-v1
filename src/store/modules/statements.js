import {formatBytes} from '../../utils'
import {isEqual, includes, uniq} from 'lodash'
import Vue from 'vue';

const state = {
    all: {},
    lastId: 0,
    duplicates: [],
};

function applyOptions(collection, options) {
    return collection.filter( s => {
        const satisfiesAccount = options.account
            ? s.accountId == options.account
            : true;

        const satisfiesDuplicates = options.duplicates
            ? true
            : !includes(state.duplicates, s.id);

        const satisfiesDeleted = options.deleted
            ? true
            : ! s.meta.deleted;

        return satisfiesAccount && satisfiesDuplicates && satisfiesDeleted;

    }).sort( (a,b) => {
        const aV = a[options.orderBy],
              bV = b[options.orderBy];

        return options.order === 'desc' ? bV-aV : aV-bV;
    })

}

const newFileObject = (id, accountId, file) => {
    return {
        id,
        accountId,
        file,
        info: {
            name: file.name,
            size: file.size,
            fileSize: formatBytes(file.size, 0),
            type: file.type,
            lastModified: file.lastModified,
            lastModifiedDate: file.lastModifiedDate.toISOString(),
        },
        duplicates: [],
        meta: {
            uploaded: (new Date()).toISOString()
        }
    }
};

const defaultOptions = {
    deleted: false,
    duplicates: false,
    orderBy: 'id',
    order: 'desc'
};

const getters = {
    ALL: state => Object.values(state.all),
    QUERY: state => (options) => {
        const opts = {...defaultOptions, ...options};
        return applyOptions( Object.values(state.all), opts);
    },
    DELETED: state => Object.values(state.all).filter(f => !! f.meta.deleted),
    UNIQUE: state => Object.values(state.all).filter(f => !includes(state.duplicates, f.id)),
    GET: state => id => state.all[id] || null,
    GET_LAST: state => state.all[state.lastId] || null,
    DUPLICATES: state => state.duplicates,
    DUPLICATES_COUNT: state => state.duplicates.length
};

const mutations = {
    ADD_FILE: ( state, { file, accountId } ) => {
        // TODO add check on account
        const id = state.lastId +1;
        Vue.set(state.all, id, newFileObject(id, accountId, file) );
        state.lastId = id;
    },
    DELETE_FILE: ( state, {id} ) => {
        const file = state.all[id] || null;
        file && Vue.set( file.meta, 'deleted', (new Date()).toISOString() )
    },
    ADD_DUPLICATE_FILE: ( state, { file, original }) => {
        const originalFile = state.all[original] || null;
        originalFile && Vue.set(originalFile, 'duplicates', uniq([...originalFile.duplicates, file.id]));
        state.duplicates.push( file.id )
    }
};

const actions = {
    ADD({commit, dispatch, getters}, { accountId, file }) {

        commit('ADD_FILE', { file, accountId });

        // check for duplication
        const saved = getters.GET_LAST;

        const duplicateOf = getters.QUERY({deleted: false}).find( f => {
            return f.id !== saved.id && isEqual(f.info,saved.info)
        });

        if( duplicateOf ) {
            return new Promise( (resolve,reject) => {
                commit('ADD_DUPLICATE_FILE', { saved, original: duplicateOf.id });
                reject({
                    error: true,
                    type: 'STATEMENT_DUPLICATE',
                    message: "We identified this statement as a duplicate of one already added, so we haven't processed it",
                    data: {
                        file: saved,
                        original: duplicateOf
                    }
                });
            })
        }

        return dispatch('processor/PROCESS_PDF_FILE', { file: saved, accountId }, {root: true});
    },
    ADD_MULTIPLE({dispatch}, { accountId, files }) {
        files.forEach( file => dispatch('ADD', { accountId, file }) )
    },
    DELETE_FILE({commit}, {id}) {
        commit('DELETE_FILE', {id});
    }
};

export default {
    namespaced: true,
    state,
    getters,
    mutations,
    actions
}