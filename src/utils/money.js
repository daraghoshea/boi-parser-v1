import Dinero from 'dinero.js'
import {countFractionDigits, isFloat, isNumeric} from "./numbers";
import {isString} from "lodash";

/**
 * Factory method to create a new money object
 *
 * @param values
 * @throws Error
 */
export function money(...values) {
    if( ! values.length ) {
        return new Dinero;
    }

    if( values.length > 1 ) {
        const amount = values[0];
        const currency = ( isString(values[1]) && values[1].length === 3 ) ? values[1] : "EUR";
        const precision = (isNumeric(values[2]) && values[2] > 0 && values[2] <= 3) ? values[2] : 2;
        return Dinero({ amount, currency, precision });
    }

    let value = values[0];

    if( isMoney(value) ) {
        return value;
    }

    if( isMoneyJson(value) ) {
        return Dinero(value);
    }

    if( isString(value) ) {
        return Dinero({amount: textToAmount(value)});
    }

    if( typeof value === "number" ) {
        return Dinero({amount: value});
    }

    if( typeof value !== "object" ) {
        throw new Error("Incorrect use of money factory method, no object found")
    }

    if( isNumeric(value.amount) && Number.isInteger(value.amount) ) {
        return Dinero(value);
    }

    throw new Error("Money factory requires an object with an amount property with an integer value");
}

/**
 * valueObject takes the structure
 * {
 *     amount: Number,
 *     currency: String (3 letter code)
 *     precision: Number (number of decimal places, usually 2)
 * }
 * @param valueObj
 * @param format String
 * @returns {*|String}
 * @throws Error
 */
export function formatMoney(valueObj, format="0,0.00") {
    return money(valueObj).toFormat(format);
}

/**
 * @param value
 * @return {boolean}
 */
export function isMoney(value) {
    if( typeof value !== 'object' ) {
        return false;
    }

    return typeof value.getAmount === 'function' && typeof value.getCurrency === 'function';
}

export function isMoneyJson(value) {
    return value.hasOwnProperty('amount') && value.hasOwnProperty('currency') && value.hasOwnProperty('precision');
}

/**
 * @param obj
 */
export function reverseMoneySign( obj ) {
    if( ! isMoney(obj) ) {
        throw new Error("only money objects can be passed to `reverseMoneySign` function");
    }

    let m = money(obj).toObject();

    return money(m.amount * -1, m.currency, m.precision);
}

export function isTextAmount(text) {
    return text.match(/^[0-9,]+\.[0-9]{2}$/);
}

/**
 *
 * @param text
 * @param decimalPlaces
 * @return {*|Number|number}
 */
export function textToAmount(text, decimalPlaces = 2) {
    if( typeof text === 'number' ) {
        if( isFloat()) {
            return text;
        }
    }

    if( typeof text === 'object' && !! text.getAmount ) {
        return text.getAmount();
    }

    if( typeof text !== 'string') {
        throw new Error('textToAmount converts strings only, not ' + typeof text)
    }

    text = text.replace(/[^0-9.-]/g, '');
    const foundDecimalPlaces = countFractionDigits(text);

    return Math.round(
        Number.parseInt( text.replace('.','') )
        * ( Math.pow(10, decimalPlaces - foundDecimalPlaces ) )
    );
}

/**
 *
 * @param text
 * @param decimalPlaces
 * @return {{getAmount}|Object|{hasSameAmount: (function(Dinero): boolean), hasCents: (function(): boolean), isPositive: (function(): boolean), convert: (function(String): Promise<T>), toJSON: (function(): (*|{amount: *, precision: *, currency: *})), convertPrecision: (function(Number): any), percentage: (function(*=): (*|Dinero)), lessThan: (function(Dinero): boolean), hasSubUnits: (function(): boolean), isZero: (function(): boolean), divide: (function(Number): any), toObject: (function(): {amount: *, precision: *, currency: *}), multiply: (function(Number): any), getAmount: (function(): *), greaterThan: (function(Dinero): boolean), add: (function(Dinero): any), getCurrency: (function(): *), isNegative: (function(): boolean), hasSameCurrency: (function(Dinero): boolean), subtract: (function(Dinero): any), toUnit: (function(): (*|Number)), getPrecision: (function(): *), greaterThanOrEqual: (function(Dinero): boolean), toRoundedUnit: (function(Number): (*|Number)), toFormat: (function(): string), allocate: (function(Number[]): any[]), lessThanOrEqual: (function(Dinero): boolean), getLocale: (function(): (*|string|String)), equalsTo: (function(Dinero): (*|Boolean)), setLocale: (function(String): any)}}
 */
export function textToMoney(text, decimalPlaces = 2) {
    if( typeof text === 'object' && !! text.getAmount ) {
        return text;
    }

    const amount = textToAmount(text, decimalPlaces);
    return Dinero({amount});
}



export function sumAmounts( amounts ) {
    return amounts.reduce( (total, amount) => {
        return total.add(money(amount));
    }, money())
}