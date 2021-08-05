import {formatBytes} from '../../utils'
import {isEqual, includes, uniq} from 'lodash'
import Vue from 'vue';

const state = {
    all: {},
    lastId: 0,
    duplicates: []
};

const findEarlierUpload = (files, file) => {
    return files.find( (f) => {
        return f.id !== file.id && isEqual(f.info,file.info)
    });
};

const newFileObject = (id, file, meta) => {
    return {
        id,
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
            ...meta,
            uploaded: (new Date()).toISOString(),
        }
    }
};

const getters = {
    all: state => state.all,
    deleted: state => Object.values(state.all).filter(f => !! f.meta.deleted),
    files: state => Object.values(state.all).filter(f => !includes(state.duplicates, f.id) && !f.meta.deleted ),
    getFile: state => id => state.all[id],
    getLastFile: state => state.all[state.lastId],
    GET_DUPLICATES_COUNT: state => state.duplicates.length
};

const mutations = {
    ADD_FILE: ( state, file ) => {
        const nextId = state.lastId +1;
        Vue.set(state.all, nextId, { ...file, id: nextId });
        state.lastId = nextId;
    },
    DELETE_FILE: ( state, {id} ) => {
        const file = state.all[id] || null;
        file && Vue.set( file.meta, 'deleted', (new Date()).toISOString() )
    },
    ADD_DUPLICATE_FILE: ( state, { file, original }) => {
        const originalFile = state.all[original];
        originalFile && Vue.set(originalFile, 'duplicates', uniq([...originalFile.duplicates, file.id]));
        state.duplicates.push( file.id )
    }
};

const actions = {
    ADD({commit, dispatch, getters, rootGetters}, { file, accountId }) {
        // Assert valid accountId
        const account = rootGetters['accounts/FIND_BY_ID'](accountId);

        if( ! account ) {
            throw new Error(`Could not find valid account to upload statement`);
        }

        commit('ADD_FILE', newFileObject( file, { accountId } ));

        // check for duplication
        file = getters.getLastFile();
        const earlierUpload = findEarlierUpload(getters.all, file);
        if( earlierUpload ) {
            commit('ADD_DUPLICATE_FILE', { file, original: earlierUpload.id });
        }
        else {
            dispatch('processor/PROCESS_PDF_FILE', { id: file.id, accountId }, {root: true});
        }
    },
    ADD_MULTIPLE({dispatch}, { files, accountId }) {
        files.forEach( file => dispatch('ADD', { file, accountId }) )
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