import {mutations} from '../../../src/store/modules/transactions'

var state = {
    all: {},
    lastId: 0,
    allocations: {}
};

beforeEach(() => {
    state = {
        all: {},
        lastId: 0,
        allocations: {}
    };
});

describe('transaction mutations', () => {
    test('it adds a transaction', () => {
        const transaction = {
            date: "",
            desc: "description",
            amount: {
                value: 100,
                currency: "EUR",
                precision: 2
            },
            type: 'dr'
        };
        const meta = { key: 'value' };

        mutations.ADD(state, {transaction, meta});

        expect(state.all[1].data).toMatchObject(transaction);
        expect(state.all[1].meta).toMatchObject(meta);
        expect(state.lastId).toEqual(1);

    })
});