import { mutations, actions } from '../../../src/store/modules/contacts';
import {testAction} from '../../utils'

const state = {
    all: {},
    lastId: 0
};

test('it should add a company', () => {
    const payload = {
        company: { name: "test" }
    };

    mutations.ADD_COMPANY( state, payload );

    expect( state.all[1] ).toMatchObject( payload )
    expect( state.lastId ).toEqual(1);
});

test('it should edit a company', () => {
    state.all[1] = {
        id: 1,
        company: { name: "test" }
    };

    mutations.EDIT_COMPANY(state, {id: 1, company: {name: "edited"}})

    expect( state.all[1].company.name ).toEqual("edited");
});

test('it should only allow unique company names', () => {
    state.all[1] = {
        id: 1,
        company: { name: "test" }
    };

    expect(() => {
        mutations.ADD_COMPANY( state, { company: {name: "TEST"}} );
    }).toThrow();

});

test('it should mark a company as a customer', () => {
    state.all[1] = {
        id: 1,
        company: { name: "test" }
    };

    mutations.SET_CUSTOMER( state, {id: 1});

    expect( state.all[1].meta.customer ).toEqual( true )
});

test('it should add a person to a company', () => {
    state.all[1] = {
        id: 1,
        company: {name: 'test'}
    }

    const people = [
        {name: 'joe'}
    ];

    mutations.SET_PEOPLE(state, {id: 1, people });

    expect( state.all[1].people ).toMatchObject(people);
});

test('it should not allow a person with no name', () => {
    state.all[1] = {
        id: 1,
        company: {name: 'test'}
    };

    const people = [
        {name: ''}
    ];

    expect(() => {
        mutations.SET_PEOPLE(state, {id: 1, people })
    }).toThrow()
});

test('it should save a company and people for new add', () => {
    const payload = {
        company: { name: "test" },
        people: [
            { name: "Joe", email: "joe@bloggs.ie" }
        ]
    };

    const results = testAction(actions.SAVE_CONTACT, payload, state);

    const expectedMutations = [
        { type: 'ADD_COMPANY', payload: { company: payload.company } },
        { type: 'SET_PEOPLE', payload: { people: payload.people } }
    ];

    expect(results.commits.length).toEqual(expectedMutations.length);

    expectedMutations.forEach((mutation, i) => {
        expect(results.commits[i].type).toEqual(mutation.type);
        expect(results.commits[i].payload).toMatchObject(mutation.payload);
    })
});

test('it should save a company when editing', () => {
    state[1] = {
        id: 1,
        company: { name: "test" },
        people: []
    };

    const { id, company, people } = {
        id: 1,
        company: { name: "test" },
        people: [
            { name: "Joe", email: "joe@bloggs.ie" }
        ]
    };

    const results = testAction(actions.SAVE_CONTACT, { id, company, people }, state);

    const expectedMutations = [
        { type: 'EDIT_COMPANY', payload: { id, company } },
        { type: 'SET_PEOPLE', payload: { id, people } }
    ];

    expect(results.commits.length).toEqual(expectedMutations.length);

    expectedMutations.forEach((mutation, i) => {
        expect(results.commits[i].type).toEqual(mutation.type);
        expect(results.commits[i].payload).toMatchObject(mutation.payload);
    })
})
