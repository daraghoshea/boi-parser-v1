import {isDate} from "./utils";
import {isTextAmount, money, reverseMoneySign, textToMoney} from "./utils/money";
import {calculateSumEqualsValue} from "./utils/numbers";

function getTransactionLines(text) {
    const pageLines = text.split("\n");

    let firstLineIndex, lastLineIndex;

    try {
        firstLineIndex = getFirstTransactionLine(pageLines);
        lastLineIndex = getLastTransactionLine(pageLines, firstLineIndex);
    }
    catch(e) {
        return [];
    }

    return pageLines.slice(firstLineIndex, lastLineIndex)
        .filter(val => val.trim() !== '');
}

function isFirstTransactionLine(line, prevLine) {
    return isBoiDate(line) && prevLine === "Balance";
}

function getFirstTransactionLine(lines) {
    for( let i=1; i < lines.length; i++) {
        if( isFirstTransactionLine(lines[i], lines[i-1])) {
            return i;
        }
    }
    throw new Error('first transaction line not found');
}

function getLastTransactionLine(lines, firstLineIndex) {
    for( let i=firstLineIndex+1; i < lines.length; i++) {
        let line = lines[i];

        // "Subtotal: " indicates previous line was end of list
        if( line.match(/^Subtotal:\s/i) ) {
            return i+1;
        }

        // If the line length is longer than 21 chars, then not a transaction line string
        if( line.length > 21 ) {
            return i;
        }

    }
    throw new Error('last transaction line not found');
}

function parseFileTransactionLines(lines) {
    window.console.log(lines.slice(85,100));
    let i = 0;
    let dates = {};
    let currDate = null;
    let currDesc = null;
    let currAmount = null;
    let currBalance = null;

    if( ! lines.length ) {
        return [];
    }

    const isBalanceForwardText = (text) => {
        return text && text.match(/Balance Forward/i);
    };

    const addDate = (date) => {
        // setup already
        if( dates[date] ) {
            return;
        }

        // new date
        dates[date] = {
            date,
            transactions: [],
            balance: {
                opening: currBalance ? currBalance.toObject() : null,
                closing: null
            }
        };

        currDate = date;
        currDesc = null;
        currAmount = null;
        currBalance = null;
    };

    const addTransaction = (date, desc, amount) => {
        dates[date].transactions.push({
            date,
            desc: desc,
            value: textToMoney(amount).toObject()
        });

        currAmount = amount
    };

    const addClosingBalance = (date, balance) => {
        if( dates[date].balance.closing ) {
            return;
        }

        let closing = money(balance);

        dates[date].balance.closing = closing.toObject();

        // if opening balance was null, then make same as closing balance
        // should only be the case for first transaction date
        if( dates[date].balance.opening === null ) {
            dates[date].balance.opening = closing.toObject();
        }

        // calculate delta in balance
        dates[date].balance.delta = closing.subtract( money( dates[date].balance.opening ) ).toObject();

        currBalance = closing;  // save to use on next iteration
        currDate = null;
        currDesc = null;
        currAmount = null;
    };

    const nextValue = () => {
        i++;

        while(i < lines.length) {
            if (lines[i].trim() !== '') {
                break;
            }
            i++;
        }

        return lines[i]
    }

    do {

        let line = lines[i];

        // Ignore empty
        if(! lines[i] || ! lines[i].trim()) {
            i++;
            continue;
        }

        try {

            // Process Date
            if (isBoiDate(line)) {
                addDate(line);

                // next line should be the description
                currDesc = nextValue()

                nextValue()
                continue;
            }

            if (isTextAmount(line)) {
                // 2 amounts in a row mean it is a balance amount
                if (currAmount || isBalanceForwardText(currDesc)) {
                    addClosingBalance(currDate, line);
                    nextValue()
                    continue;
                }

                if (currDesc === null) {
                    throw new Error(`unexpected missing description when parsing amount ${line} for date ${currDate}`);
                }

                addTransaction(currDate, currDesc, line);
                nextValue()
                continue;
            }
        } catch(e) {
            console.log(i, "\n", line) // eslint-disable-line
            console.log(currDate, "\n", currDesc, "\n", currAmount, "\n", currBalance) // eslint-disable-line
        }

        currDesc = line;
        currAmount = null;  // Reset otherwise will mistake transaction value for closing balance
        nextValue();

    } while ( i < lines.length );

    // Sort by date and transform data
    let transactions = transformTransactions( Object.values(dates) );

    const reducer = (type) => {
        return (acc, value) => {
            return acc.add( money(value.subtotals[type]) );
        }
    };

    let debits = transactions.reduce( reducer('debits'), money() ).toObject(),
        credits = transactions.reduce( reducer('credits'), money() ).toObject();

    return {
        balance: {
            opening: transactions[0].balance.opening,
            closing: transactions[ transactions.length-1 ].balance.closing,
            delta: money( transactions[ transactions.length-1 ].balance.closing ).subtract( money(transactions[0].balance.opening) ).toObject()
        },
        subtotals: {
            debits: debits,
            credits: credits,
            delta: money(credits).subtract(money(debits)).toObject()
        },
        transactions
    }
}

function transformTransactions( transactions ) {
    // order by date
    transactions = transactions.sort( (a,b) => {
        let aD = new Date(a.date), bD = new Date(b.date);
        return aD <= bD ? -1 : 1;
    });

    // transform and return
    return transactions.map( transformDayTransactions );
}

function transformDayTransactions( day ) {

    if( ! day.balance.closing ) {
        // window.console.log(day);
    }

    const combination = calculateSumEqualsValue(
        day.transactions.map( (t) => t.value.amount ),
        money( day.balance.delta ).getAmount()
    );



    day.sumCalc = {
        inputs: day.transactions.map( (t) => t.value.amount ),
        target: money( day.balance.delta ).getAmount(),
        combination
    };

    let credits = [], debits = [];

    // utility function to determine type and keep track of each to subtotal later
    let getAndSaveTransactionType = ( amount ) => {
        if( amount >= 0 ) {
            credits.push(amount);
            return 'cr';
        }

        // save as positive value, negative sign causes issues
        debits.push( Math.abs(amount) );
        return 'dr';
    };

    // Transform the day's transactions
    day.transactions = day.transactions.map( (t) => {

        let amount = money( t.value );

        // Change sign if not found in winning combo to calculate if `dr` or `cr`
        if( ! combination.includes( amount.getAmount() ) ) {
            amount = reverseMoneySign( amount );
        }

        // Determine if DR or CR type
        t.type = getAndSaveTransactionType( amount.getAmount() );

        // Don't include negative sign when returning
        if( amount.isNegative() ) {
            amount = reverseMoneySign( amount );
        }

        t.value = amount.toObject();

        return t;
    });

    let creditsTotal = credits.reduce( (acc,v) => acc.add( money(v) ), money() ),
        debitsTotal = debits.reduce( (acc,v) => acc.add( money(v) ), money() );

    day.subtotals = {
        credits: creditsTotal.toObject(),
        debits: debitsTotal.toObject(),
        delta: creditsTotal.subtract( debitsTotal ).toObject()
    };

    // Check if opening + delta = closing

    // if( ! money(day.balance.opening).add( money(day.subtotals.delta) ).toEquals( money(day.balance.closing) ) ) {
    //     day.error = {
    //         message: "difference between credits and debits not equal to balance difference",
    //     }
    // }

    return day;
}

function formatTransactionLines(transactionsByDate) {
    let transactions = [];
    let currBalance = null;

    transactionsByDate.transactions.forEach( (day) => {

        if( currBalance === null ) {
            currBalance = day.balance;
            return;
        }

        day.transactions.forEach( (transaction) => {
            transactions.push({
                date: day.date,
                desc: transaction.desc,
                amount: money(transaction.value).toFormat("0,0.00"),
                type: transaction.type
            });
        })
    });

    return transactions;
}

function isBoiDate(text) {
    if( ! text.match(/^[0-9]{2}\s[a-zA-Z]{3}\s[0-9]{4}$/) ) {
        return false;
    }

    return isDate(text);
}

export {
    getTransactionLines,
    formatTransactionLines,
    parseFileTransactionLines
};