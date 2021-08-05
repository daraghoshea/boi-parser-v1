import { parseFileTransactionLines } from "../../src/boi";
import Dinero from 'dinero.js'

Dinero.defaultCurrency = 'EUR';

const linesArray = [
    "29 Nov 2019",
    "BALANCE FORWARD",
    "2,105.15",
    "16 Dec 2019",
    "In",
    "45.00",
    "Out",
    "12.50",
    "2,137.65"
];

const expected = {
    balance: {
        opening: { amount: 210515 },
        closing: { amount: 213765 }
    },
    transactions: [
        {
            date: '29 Nov 2019',
            transactions: [],
            balance: {
                opening: { amount: 210515 },
                closing: { amount: 210515 },
                delta: { amount: 0 }
            },
            subtotals: {
                debits: { amount: 0 },
                credits: { amount: 0 },
                delta: { amount: 0 }
            }
        },
        {
            date: '16 Dec 2019',
            transactions: [
                { desc: "In", value: { amount: 4500 }, type: "cr" },
                { desc: "Out", value: { amount: 1250 }, type: "dr" }
            ],
            balance: {
                opening: { amount: 210515 },
                closing: { amount: 213765 },
                delta: { amount: 3250 }
            },
            subtotals: {
                delta: {amount: 3250},
                debits: {amount: 1250},
                credits: {amount: 4500}
            }
        }
    ],
    subtotals: {
        debits: { amount: 1250 },
        credits: { amount: 4500 },
        delta: { amount: 3250 }
    }
};


test("should correctly parse text lines into an object", () => {
    expect( parseFileTransactionLines( linesArray ) )
        .toMatchObject(expected);
});

test("this complicated one should work too", () => {
    let testData = [
        "29 Nov 2019",
        "BALANCE FORWARD", "22,524.16",
        "16 Dec 2019",
        "In1", "12,000.00",
        "Out1", "0.22",
        "Out2", "16.00",
        "Out3", "13.70",
        "Out4", "10.80",
        "34,483.44"
    ];

    expect(parseFileTransactionLines(testData))
        .toMatchObject({
            balance: {
                opening: { amount: 2252416 },
                closing: { amount: 3448344 },
                delta: { amount: 1195928 }
            },
            transactions: [
                {
                    date: '29 Nov 2019',
                    transactions: [],
                    balance: {
                        opening: { amount: 2252416 },
                        closing: { amount: 2252416 },
                        delta: { amount: 0 }
                    },
                    subtotals: {
                        debits: { amount: 0 },
                        credits: { amount: 0 },
                        delta: { amount: 0 }
                    }
                },
                {
                    date: '16 Dec 2019',
                    transactions: [
                        { desc: "In1", value: { amount: 1200000 }, type: "cr" },
                        { desc: "Out1", value: { amount: 22 }, type: "dr" },
                        { desc: "Out2", value: { amount: 1600 }, type: "dr" },
                        { desc: "Out3", value: { amount: 1370 }, type: "dr" },
                        { desc: "Out4", value: { amount: 1080 }, type: "dr" }
                    ],
                    balance: {
                        closing: { amount: 3448344 },
                        opening: { amount: 2252416 },
                        delta: { amount: 1195928 }
                    },
                    subtotals: {
                        delta: { amount: 1195928 },
                        debits: { amount: 4072 },
                        credits: { amount: 1200000 }
                    }
                }
            ],
            subtotals: {
                debits: { amount: 4072 },
                credits: { amount: 1200000 },
                delta: { amount: 1195928 }
            }
        });
});

test('another one', () => {
    let lines = [
        "29 Nov 2019",
        "BALANCE FORWARD", "1,000.00",
        "16 Dec 2019",
        "Out1", "10.00",
        "Out2", "10.00",
        "Out3", "10.00", "970.00",
        "17 Dec 2019",
        "Out4", "10.00", "960.00"
    ];

    expect(parseFileTransactionLines(lines))
        .toMatchObject({
            balance: {
                opening: { amount: 100000 },
                closing: { amount: 96000 },
                delta: { amount: -4000 }
            },
            transactions: [
                {
                    date: '29 Nov 2019',
                    transactions: [],
                    balance: {
                        opening: { amount: 100000 },
                        closing: { amount: 100000 },
                        delta: { amount: 0 }
                    },
                    subtotals: {
                        debits: { amount: 0 },
                        credits: { amount: 0 },
                        delta: { amount: 0 }
                    }
                },
                {
                    date: '16 Dec 2019',
                    transactions: [
                        { desc: "Out1", value: { amount: 1000 }, type: "dr" },
                        { desc: "Out2", value: { amount: 1000 }, type: "dr" },
                        { desc: "Out3", value: { amount: 1000 }, type: "dr" }
                    ],
                    balance: {
                        closing: { amount: 97000 },
                        opening: { amount: 100000 },
                        delta: { amount: -3000 }
                    },
                    subtotals: {
                        delta: { amount: -3000 },
                        debits: { amount: 3000 },
                        credits: { amount: 0 }
                    }
                },
                {
                    date: '17 Dec 2019',
                    transactions: [
                        { desc: "Out4", value: { amount: 1000 }, type: "dr" }
                    ],
                    balance: {
                        closing: { amount: 96000 },
                        opening: { amount: 97000 },
                        delta: { amount: -1000 }
                    },
                    subtotals: {
                        delta: { amount: -1000 },
                        debits: { amount: 1000 },
                        credits: { amount: 0 }
                    }
                }
            ],
            subtotals: {
                debits: { amount: 4000 },
                credits: { amount: 0 },
                delta: { amount: -4000 }
            }
        });
});

test('awkward descriptions', () => {
    let lines = [
        "01 Mar 2018",
            "BALANCE FORWARD","4,167.77",
        "06 Mar 2018",
            "BOI BOL CHARGE","10.00","4,157.77",
        "23 Mar 2018",
            "NOTIFIED INTEREST",    "12.94",
            "NOTIFIED FEES",        "16.05",
            "POS CHG GBP        7", "0.18",
            "P2103GB  7.99@.870370","9.18","4,119.42",
        "28 Mar 2018",
            "BOI BOL CHARGE","10.00","4,109.42"
    ];

    expect(parseFileTransactionLines(lines))
        .toMatchObject({
            balance: {
                opening: { amount: 416777 },
                closing: { amount: 410942 },
                delta: { amount: -5835 }
            },
            transactions: [
                {
                    date: '01 Mar 2018',
                    transactions: [],
                    balance: {
                        opening: { amount: 416777 },
                        closing: { amount: 416777 },
                        delta: { amount: 0 }
                    },
                    subtotals: {
                        debits: { amount: 0 },
                        credits: { amount: 0 },
                        delta: { amount: 0 }
                    }
                },
                {
                    date: '06 Mar 2018',
                    transactions: [
                        { desc: "BOI BOL CHARGE", value: { amount: 1000 }, type: "dr" }
                    ],
                    balance: {
                        closing: { amount: 415777 },
                        opening: { amount: 416777 },
                        delta: { amount: -1000 }
                    },
                    subtotals: {
                        delta: { amount: -1000 },
                        debits: { amount: 1000 },
                        credits: { amount: 0 }
                    }
                },
                {
                    date: '23 Mar 2018',
                    transactions: [
                        { desc: "NOTIFIED INTEREST", value: { amount: 1294 }, type: "dr" },
                        { desc: "NOTIFIED FEES", value: { amount: 1605 }, type: "dr" },
                        { desc: "POS CHG GBP        7", value: { amount: 18 }, type: "dr" },
                        { desc: "P2103GB  7.99@.870370", value: { amount: 918 }, type: "dr" }
                    ],
                    balance: {
                        closing: { amount: 411942 },
                        opening: { amount: 415777 },
                        delta: { amount: -3835 }
                    },
                    subtotals: {
                        delta: { amount: -3835 },
                        debits: { amount: 3835 },
                        credits: { amount: 0 }
                    }
                },
                {
                    date: '28 Mar 2018',
                    transactions: [
                        { desc: "BOI BOL CHARGE", value: { amount: 1000 }, type: "dr" }
                    ],
                    balance: {
                        closing: { amount: 410942 },
                        opening: { amount: 411942 },
                        delta: { amount: -1000 }
                    },
                    subtotals: {
                        delta: { amount: -1000 },
                        debits: { amount: 1000 },
                        credits: { amount: 0 }
                    }
                },
            ],
            subtotals: {
                debits: { amount: 5835 },
                credits: { amount: 0 },
                delta: { amount: -5835 }
            }
        });
});
