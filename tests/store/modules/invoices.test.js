import { mutations, statuses } from '../../../src/store/modules/invoices';

const state = {
    all: {},
    lastId: 0
};

test('it should add an invoice', () => {
    const invoice = {
        number: 1,
        contact: 1,
    };

    mutations.ADD( state, { invoice } );

    expect( state.all[1] ).toMatchObject( { id: 1, data: invoice, status: statuses.DRAFT } );
    expect( state.lastId ).toEqual(1);
});

test('it should not allow an invoice with no number', () => {
    const invoice = {};
    expect(() => {
        mutations.ADD( state, { invoice } );
    }).toThrow()
});

test('it should not allow an invoice with no contact if not in draft', () => {
    const invoice = {};
    expect(() => {
        mutations.ADD( state, { invoice } );
    }).toThrow()
});

test('it should not allow a duplicate invoice number when adding', () => {
    const id = 1;
    const state = {
        all: {
            1: {
                id,
                data: {
                    number: 1,
                    contact: null,
                    lines: []
                }
            }
        },
        lastId: 1
    };

    expect(() => {
        mutations.ADD(state, { invoice: { number: 1, contact: 1 }})
    }).toThrow()
});

test("it should allow to edit an invoice still in draft", () => {
    const id = 1;
    const state = {
        all: {
            1: {
                id,
                data: {
                    number: 1,
                    contact: null,
                    lines: []
                },
                status: statuses.DRAFT
            }
        },
        lastId: 1
    };

    mutations.EDIT(state, { id, invoice: { ...state.all[id].data, contact: 1 }});

    expect(state.all[id].data.contact).toEqual(1);
});

test("it shouuld not allow save an invoice that doesn't exist", () => {
    const state = {
        all: {},
        lastId: 0
    };
    expect(() => {
        mutations.EDIT(state, { id: 1, invoice: { number: 1 }})
    }).toThrow()
});

test('it should not allow a duplicate invoice number when editing', () => {
    const state = {
        all: {
            1: {id: 1, data: {number: 1}, status: statuses.DRAFT},
            2: {id: 2, data: {number: 2}, status: statuses.DRAFT}
        },
        lastId: 2
    };

    expect(() => {
        mutations.EDIT(state, { id: 2, invoice: { number: 1 }})
    }).toThrow()
});

test("it should not allow invalid status", () => {
    const id = 1;
    const state = {
        all: {
            1: {id: 1, data: {number: 1}, status: statuses.DRAFT},
        },
        lastId: 1
    };

    expect( () => {
        mutations.SET_STATUS(state, {id, status: 'causes an error'});
    }).toThrow()
});

test("it should not allow to change back to draft if already changed", () => {
    const state = {
        all: {
            1: {id: 1, data: {number: 1}, status: statuses.SENT},
            2: {id: 2, data: {number: 1}, status: statuses.AWAITING},
            3: {id: 3, data: {number: 1}, status: statuses.PAID},
        },
        lastId: 3
    };

    expect( () => {
        mutations.SET_STATUS(state, {id: 1, status: statuses.DRAFT})
    }).toThrow();

    expect( () => {
        mutations.SET_STATUS(state, {id: 2, status: statuses.DRAFT})
    }).toThrow();

    expect( () => {
        mutations.SET_STATUS(state, {id: 3, status: statuses.DRAFT})
    }).toThrow();
});

test("changing from draft requires a contact to be set", () => {
    const state = {
        all: {
            1: {
                id: 1,
                data: {number: 1},
                status: statuses.SENT
            }
        },
        lastId: 1
    };
    expect( () => {
        mutations.SET_STATUS(state, {id: 1, status: statuses.SENT})
    }).toThrow('contact');
});

test("changing from draft requires at least one line", () => {
    const state = {
        all: {
            1: {
                id: 1,
                data: {number: 1, contact: 1},
                status: statuses.SENT,
            }
        },
        lastId: 1
    };
    expect( () => {
        mutations.SET_STATUS(state, {id: 1, status: statuses.SENT})
    }).toThrow('lines');
});

test("changing from draft requires all lines to have a description", () => {
    const state = {
        all: {
            1: {
                id: 1,
                data: {number: 1, contact: 1, lines: [{description: ""}]},
                status: statuses.SENT,
            }
        },
        lastId: 1
    };
    expect( () => {
        mutations.SET_STATUS(state, {id: 1, status: statuses.SENT})
    }).toThrow('description');
});
