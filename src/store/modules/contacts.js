import Vue from 'vue'
import {uniq} from 'lodash'
import ContactsFilter from './contacts-filter'

const state = {
    all: {},
    lastId: 0,
};

/**
 * @throws Error
 */
function assertValidCompany(state, id, company) {
    // Name required
    if( ! company.name ) {
        throw new Error('Contact name is required')
    }

    // Unique name required
    const nameMatch = Object.values(state.all).find( c => c.company && c.company.name.toUpperCase() === company.name.toUpperCase() );
    if( nameMatch ) {
        if( !id || id !== nameMatch.id ) {
            throw new Error(`'${company.name}' already exists`)
        }
    }
}

/**
 * @throws Error
 */
function assertValidPeople(people) {
    if( ! Array.isArray(people) ) {
        throw new Error('People not a valid array')
    }

    people.forEach( person => {
        if( ! person.name ) {
            throw new Error('No valid name provided for the company contact')
        }
    })
}

function sanitizeCompany(company) {
    company.name = company.name.trim();
    return company;
}

function sanitizePeople(people) {
    if( ! people || ! people.length ) {
        return [];
    }
    return people.map(person => {
        return {
            name: (person.name + "").trim(),
            email: person.email ? (person.email + "").trim() : null
        }
    })
}

const getters = {
    /** @returns Object */
    ALL: state => Object.values(state.all),

    /** @returns Function */
    GET: state => options => {
        const filter = new ContactsFilter( Object.values(state.all), {
            orderBy: 'name',
            order: 'asc',
            deleted: false,
            ...options
        });

        return filter.filtered;
    },
    /** @returns Function */
    FIND_BY_ID: state => id => {
        return state.all[id] || null;
    },

    /** @returns Object */
    FIND_BY_IDS: state => ids => {
        return Object.fromEntries(uniq(ids).reduce( (map, id) => {
            map.set(id, state.all[id] || null );
            return map;
        }, new Map))
    },

    /** @returns Number */
    LAST_ID: state => state.lastId
};

export const mutations = {
    ADD_COMPANY: (state, { company }) => {
        company = sanitizeCompany(company);
        assertValidCompany(state, null, company);
        const nextId = state.lastId +1;

        Vue.set(state.all, nextId, {
            id: nextId,
            company,
            people: [],  // Ready for adding later
            meta: {}     // For adding additional info
        });

        return state.lastId = nextId;
    },
    EDIT_COMPANY: (state, {id, company}) => {
        company = sanitizeCompany(company);
        assertValidCompany(state, id, company);
        const contact = state.all[id] || null;
        Vue.set(contact, 'company', company)
    },
    SET_PEOPLE: (state, {id, people}) => {
        people = sanitizePeople(people);
        assertValidPeople( people );
        const company = state.all[id] || null;
        Vue.set(company, 'people', people);
        return people;
    },
    SET_CUSTOMER: (state, {id}) => {
        const company = state.all[id] || null;
        Vue.set(company, 'meta', { ...company.meta ||{}, customer: true });
    }
};

export const actions = {
    SAVE_CONTACT: ({state, commit}, {id, company, people} ) => {
        return new Promise((resolve, reject) => {
            try {
                if (!id) {
                    commit('ADD_COMPANY', { company });
                    commit('SET_PEOPLE', {id: state.lastId, people});
                    resolve(state.lastId)
                } else {
                    commit('EDIT_COMPANY', {id, company});
                    commit('SET_PEOPLE', {id, people});
                    resolve(id)
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