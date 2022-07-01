import {getTransactionLines, parseFileTransactionLines} from "../../src/boi";
import Dinero from 'dinero.js'
import {ray} from 'node-ray';

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
        opening: {amount: 210515},
        closing: {amount: 213765}
    },
    transactions: [
        {
            date: '29 Nov 2019',
            transactions: [],
            balance: {
                opening: {amount: 210515},
                closing: {amount: 210515},
                delta: {amount: 0}
            },
            subtotals: {
                debits: {amount: 0},
                credits: {amount: 0},
                delta: {amount: 0}
            }
        },
        {
            date: '16 Dec 2019',
            transactions: [
                {desc: "In", value: {amount: 4500}, type: "cr"},
                {desc: "Out", value: {amount: 1250}, type: "dr"}
            ],
            balance: {
                opening: {amount: 210515},
                closing: {amount: 213765},
                delta: {amount: 3250}
            },
            subtotals: {
                delta: {amount: 3250},
                debits: {amount: 1250},
                credits: {amount: 4500}
            }
        }
    ],
    subtotals: {
        debits: {amount: 1250},
        credits: {amount: 4500},
        delta: {amount: 3250}
    }
};


test("should correctly parse text lines into an object", () => {
    expect(parseFileTransactionLines(linesArray))
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
                opening: {amount: 2252416},
                closing: {amount: 3448344},
                delta: {amount: 1195928}
            },
            transactions: [
                {
                    date: '29 Nov 2019',
                    transactions: [],
                    balance: {
                        opening: {amount: 2252416},
                        closing: {amount: 2252416},
                        delta: {amount: 0}
                    },
                    subtotals: {
                        debits: {amount: 0},
                        credits: {amount: 0},
                        delta: {amount: 0}
                    }
                },
                {
                    date: '16 Dec 2019',
                    transactions: [
                        {desc: "In1", value: {amount: 1200000}, type: "cr"},
                        {desc: "Out1", value: {amount: 22}, type: "dr"},
                        {desc: "Out2", value: {amount: 1600}, type: "dr"},
                        {desc: "Out3", value: {amount: 1370}, type: "dr"},
                        {desc: "Out4", value: {amount: 1080}, type: "dr"}
                    ],
                    balance: {
                        closing: {amount: 3448344},
                        opening: {amount: 2252416},
                        delta: {amount: 1195928}
                    },
                    subtotals: {
                        delta: {amount: 1195928},
                        debits: {amount: 4072},
                        credits: {amount: 1200000}
                    }
                }
            ],
            subtotals: {
                debits: {amount: 4072},
                credits: {amount: 1200000},
                delta: {amount: 1195928}
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
                opening: {amount: 100000},
                closing: {amount: 96000},
                delta: {amount: -4000}
            },
            transactions: [
                {
                    date: '29 Nov 2019',
                    transactions: [],
                    balance: {
                        opening: {amount: 100000},
                        closing: {amount: 100000},
                        delta: {amount: 0}
                    },
                    subtotals: {
                        debits: {amount: 0},
                        credits: {amount: 0},
                        delta: {amount: 0}
                    }
                },
                {
                    date: '16 Dec 2019',
                    transactions: [
                        {desc: "Out1", value: {amount: 1000}, type: "dr"},
                        {desc: "Out2", value: {amount: 1000}, type: "dr"},
                        {desc: "Out3", value: {amount: 1000}, type: "dr"}
                    ],
                    balance: {
                        closing: {amount: 97000},
                        opening: {amount: 100000},
                        delta: {amount: -3000}
                    },
                    subtotals: {
                        delta: {amount: -3000},
                        debits: {amount: 3000},
                        credits: {amount: 0}
                    }
                },
                {
                    date: '17 Dec 2019',
                    transactions: [
                        {desc: "Out4", value: {amount: 1000}, type: "dr"}
                    ],
                    balance: {
                        closing: {amount: 96000},
                        opening: {amount: 97000},
                        delta: {amount: -1000}
                    },
                    subtotals: {
                        delta: {amount: -1000},
                        debits: {amount: 1000},
                        credits: {amount: 0}
                    }
                }
            ],
            subtotals: {
                debits: {amount: 4000},
                credits: {amount: 0},
                delta: {amount: -4000}
            }
        });
});

test('awkward descriptions', () => {
    let lines = [
        "01 Mar 2018",
        "BALANCE FORWARD", "4,167.77",
        "06 Mar 2018",
        "BOI BOL CHARGE", "10.00", "4,157.77",
        "23 Mar 2018",
        "NOTIFIED INTEREST", "12.94",
        "NOTIFIED FEES", "16.05",
        "POS CHG GBP        7", "0.18",
        "P2103GB  7.99@.870370", "9.18", "4,119.42",
        "28 Mar 2018",
        "BOI BOL CHARGE", "10.00", "4,109.42"
    ];

    expect(parseFileTransactionLines(lines))
        .toMatchObject({
            balance: {
                opening: {amount: 416777},
                closing: {amount: 410942},
                delta: {amount: -5835}
            },
            transactions: [
                {
                    date: '01 Mar 2018',
                    transactions: [],
                    balance: {
                        opening: {amount: 416777},
                        closing: {amount: 416777},
                        delta: {amount: 0}
                    },
                    subtotals: {
                        debits: {amount: 0},
                        credits: {amount: 0},
                        delta: {amount: 0}
                    }
                },
                {
                    date: '06 Mar 2018',
                    transactions: [
                        {desc: "BOI BOL CHARGE", value: {amount: 1000}, type: "dr"}
                    ],
                    balance: {
                        closing: {amount: 415777},
                        opening: {amount: 416777},
                        delta: {amount: -1000}
                    },
                    subtotals: {
                        delta: {amount: -1000},
                        debits: {amount: 1000},
                        credits: {amount: 0}
                    }
                },
                {
                    date: '23 Mar 2018',
                    transactions: [
                        {desc: "NOTIFIED INTEREST", value: {amount: 1294}, type: "dr"},
                        {desc: "NOTIFIED FEES", value: {amount: 1605}, type: "dr"},
                        {desc: "POS CHG GBP        7", value: {amount: 18}, type: "dr"},
                        {desc: "P2103GB  7.99@.870370", value: {amount: 918}, type: "dr"}
                    ],
                    balance: {
                        closing: {amount: 411942},
                        opening: {amount: 415777},
                        delta: {amount: -3835}
                    },
                    subtotals: {
                        delta: {amount: -3835},
                        debits: {amount: 3835},
                        credits: {amount: 0}
                    }
                },
                {
                    date: '28 Mar 2018',
                    transactions: [
                        {desc: "BOI BOL CHARGE", value: {amount: 1000}, type: "dr"}
                    ],
                    balance: {
                        closing: {amount: 410942},
                        opening: {amount: 411942},
                        delta: {amount: -1000}
                    },
                    subtotals: {
                        delta: {amount: -1000},
                        debits: {amount: 1000},
                        credits: {amount: 0}
                    }
                },
            ],
            subtotals: {
                debits: {amount: 5835},
                credits: {amount: 0},
                delta: {amount: -5835}
            }
        });
});


test.only('new format causing problems jul 22', () => {
    let text = `
Date

Transaction details

Payments - out

Payments - in

Balance
01 Sep 2020

BALANCE FORWARD

48,972.65

02 Sep 2020

NEPOSCHGUSD 000000.10

0.10
P0109US 6.15@0.84065

5.17

48,967.38
03 Sep 2020

POS02SEP GOOGLE *GSUI

11.51
POS02SEP GOOGLE *GSUI

6.40
365 Online O SHEA DA

4,000.00
365 Online MASONALEX

553.50

44,395.97
04 Sep 2020

NEPOSCHGUSD 000000.01

0.01
P0309LU 0.61@0.85245

0.52

44,395.44
07 Sep 2020

Three Ireland SEPA DD

92.25

44,303.19
08 Sep 2020

POS07SEP Adobe.com

36.29

44,266.90
11 Sep 2020

NEPOSCHGUSD 000000.51

0.51
P1009US 30.00@0.84766

25.43

44,240.96
14 Sep 2020

POSC10SEP TONERS PUB

5.60
POSC10SEP TONERS PUB

11.70
NEPOSCHGUSD 000000.20

0.20
P1309US 12.00@0.84666

10.16

44,213.30
15 Sep 2020

POS14SEP TYPEFORM S.L

36.59

44,176.71
16 Sep 2020

NEPOSCHGUSD 000000.42

0.42
P1509CA 25.00@0.84480

21.12

44,155.17
21 Sep 2020

POS18SEP ZOOM.EUR

16.93

44,138.24
25 Sep 2020

NOTIFIED FEES

19.30
POS24SEP Spotify P117

14.75

44,104.19
28 Sep 2020

NEPOSCHGUSD 000000.21

0.21
BOI BOL CHARGE

10.00
P2709US 12.00@0.86166

10.34

44,083.64
01 Oct 2020

ISPCC

SEPA DD

10.00
NEPOSCHGUSD 000000.24

0.24
P3009US 14.00@0.85571

11.98
MONEY IN

100.00

44,161.42


This is an eligible deposit under the Deposit Guarantee Scheme. For more information, please see the 'Deposit Guarantee Scheme -
Depositor Information Sheet' which is available from your branch or on our website www.bankofireland.com/dgs
`;

    let lines = getTransactionLines(text);

    expect(parseFileTransactionLines(lines))
        .toMatchObject()


});