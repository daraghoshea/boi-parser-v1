import Vue from 'vue'
import pdfjs from 'pdfjs-dist/webpack.js';
import {getTransactionLines, parseFileTransactionLines} from "../../boi";
import uploadFile from "./processor/upload";

// TODO multiple file upload not working, issue with `getDocument`

const state = {
    processing: null,
    loading: null,
    files: {}
};

const getters = {
    GET_FILE: (state, getters, rootState, rootGetters) => (fileId) => {
        return rootGetters["statements/GET"](fileId);
    }
};

export const mutations = {
    START_PROCESSING: (state, {file}) => {
        debugger // eslint-disable-line
        state.processing = file.id;
        state.loading = {};

        Vue.set( state.files, file.id, {
            file,
            uploading: {
                bytes: {
                    loaded: 0,
                    total: 0
                },
                start: null,
                end: null,
                error: null
            },
            progress: {
                started: (new Date).toISOString()
            },
            pages: null,
            transactions: null
        });
    },
    END_PROCESSING: (state, {id}) => {
        state.processing = null;
        state.files[id].progress.ended = (new Date).toISOString();
    },
    SAVE_UPLOAD_START: (state, {id}) => {
        const file = state.files[id];
        file.uploading.bytes.total = file.file.info.size;
        file.uploading.start = (new Date).toISOString();
    },
    SAVE_UPLOAD_PROGRESS: (state, {id, bytes}) => {
        const file = state.files[id];

        file.uploading.bytes.loaded = bytes;
    },
    SAVE_UPLOAD_END: (state, {id, bytes}) => {
        const file = state.files[id];
        file.uploading.end = (new Date).toISOString()
        file.uploading.bytes.loaded = bytes;
    },
    SAVE_UPLOAD_ERROR: (state, {id, message}) => {
        const file = state.files[id];
        file.uploading.error = message;
    },
    SAVE_PROGRESS: (state, { id, type }) => {
        const file = state.files[id];
        let progress = file.progress || {};
        progress[type] = (new Date).toISOString();
        Vue.set(file, 'progress', progress)
    },
    SAVE_FILE_PAGES: (state, {id, pages}) => {
        state.files[id].pages = pages;
    },
    SAVE_FILE_TRANSACTIONS: (state, {id, transactions}) => {
        state.files[id].transactions = transactions;
    }
};

export const actions = {
    PROCESS_PDF_FILE: async ({ commit, dispatch }, { file, accountId }) => {
        const id = file.id;

        commit('START_PROCESSING', {file});
        commit('SAVE_PROGRESS', {id, type: 'started'});

        // UPLOAD
        const reader = await uploadFile(file, commit)

        commit('SAVE_PROGRESS', { id, type: 'read' });

        // READ PDF
        const pdf = await loadPdfFromFileContents(reader.result);
        commit('SAVE_PROGRESS', { id, type: 'loaded' });

        // EXTRACT TEXT FROM PDF
        const pages = await extractPdfText(pdf);
        commit('SAVE_PROGRESS', { id, type: 'extracted' });
        commit('SAVE_FILE_PAGES', {
            id,
            text: pages.map( (text, i) => {
                return {
                    num: i + 1,
                    text: text,
                    dates: []
                }
            })
        });

        // PROCESS TEXT AS TRANSACTIONS
        const transactions = await parsePdfTextPages(pages);
        commit('SAVE_FILE_TRANSACTIONS', { id,transactions });
        commit('SAVE_PROGRESS', { id, type: 'parsed' });

        // PROCESS TRANSACTIONS
        dispatch(
            'transactions/ADD_MULTIPLE',
            {
                // Grouped by date, need to map to an array of transactions
                transactions: transactions.transactions.reduce( (all, day) => {
                    return [...all, ...day.transactions];
                }, []),

                meta: {
                    fileId: id,
                    accountId
                }
            },
            { root: true }
        );

        commit('END_PROCESSING', {id});
    },

};



async function loadPdfFromFileContents(contents) {
    return new Promise( resolve => {
        return pdfjs.getDocument(contents)
            .then( pdf => resolve(pdf) );
    });
}

async function extractPdfText(pdf) {
    return new Promise( resolve => {
        let promises = []; // collecting all page promises

        for (let j = 1; j <= pdf.numPages; j++) {
            let page = pdf.getPage(j);

            promises.push(page.then( (page) => {
                return page.getTextContent().then( (text) => {
                    return text.items.map( (s) => { return s.str; }).join("\n"); // value page text
                });
            }));
        }

        // Wait for all pages
        return Promise.all(promises).then( (pages) => {
            resolve(pages);
        });
    })
}

async function parsePdfTextPages(pages) {
    return new Promise( (resolve) => {

        let lines = [];

        pages.forEach( (text) => {
            lines = lines.concat( getTransactionLines(text) );
        });

        const transactions = parseFileTransactionLines(lines);

        resolve(transactions);
    });
}

export default {
    namespaced: true,
    state,
    getters,
    mutations,
    actions
};