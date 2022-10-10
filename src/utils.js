"use strict";

import moment from 'moment'
import {isString} from 'lodash'

const dateFormats = [moment.ISO_8601, 'YYYY-MM-DD', 'YYYY/MM/DD', 'DD MMM YYYY'];

//////////////////////////////////////////
// DATES /////////////////////////////////
//////////////////////////////////////////

/**
 * Checks to see if a value is a date
 * @param value Date|String
 * @return {boolean}
 */
export function isDate(value) {
    if( value instanceof Date || moment.isMoment(value) ) {
        return true;
    }

    if( isString(value) ) {
        // Try a few formats to see if they match
        for (let i = 0; i < dateFormats.length; i++) {
            if( isDateFormatMatch(value, dateFormats[i]) ) {
                return true;
            }
        }
    }

    return false;
}

/**
 * Checks to see if a string can be parsed as a date with specific format
 * Checks to make sure it re-formats as the same date string.
 *
 * @param value String
 * @param format String
 * @return {boolean}
 */
export function isDateFormatMatch(value, format) {
    let obj = moment(value.toString(), format);
    return obj.isValid() && obj.format(format) === value.toString();
}



/**
 * @param value moment|Date|String
 * @returns moment.Moment|null
 **/
export function parseDate(value) {
    if( moment.isMoment(value) ) {
        return value;
    }

    if( value instanceof Date ) {
        return moment(value);
    }

    if( isString(value) ) {
        // Try a few formats to see if they match
        for (let i = 0; i < dateFormats.length; i++) {
            if( isDateFormatMatch(value, dateFormats[i]) ) {
                return moment(value,dateFormats[i]);
            }
        }
    }

    return null;
}


export function formatBytes(bytes, decimals = 2) {
    if (bytes === 0) return '0 Bytes';

    const k = 1024;
    const dm = decimals < 0 ? 0 : decimals;
    const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];

    const i = Math.floor(Math.log(bytes) / Math.log(k));

    return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
}

//////////////////////////////////////////
// NUMBERS ///////////////////////////////
//////////////////////////////////////////



//////////////////////////////////////////
// FILES /////////////////////////////////
//////////////////////////////////////////

export function objectToCSVRow(dataObject) {
    const dataArray = [];
    for (let o in dataObject) {
        const innerValue = dataObject[o] === null ? '' : dataObject[o].toString();
        dataArray.push( escapeCsv(innerValue) );
    }
    return dataArray.join(',') + '\r\n';
}

export function escapeCsv(value) {
    let string = value;
    if (value.match && value.match(/[,|"]/))  {
        string = `"${value.replace('"','""')}"`
    }
    return encodeURIComponent(string);
}

export function arrayToCsvEncodedUri(array) {

    if (!array.length) {
        return;
    }

    let csv = "data:text/csv;charset=utf-8,";

    // headers
    csv += objectToCSVRow(Object.keys(array[0]));

    array.forEach( (item) => {
        csv += objectToCSVRow(item);
    });

    return csv;
}


export function downloadCsv( data, name = 'download.csv' ) {
    // Create a virtual Anchor tag
    const link = document.createElement('a');
    link.setAttribute('href', arrayToCsvEncodedUri( data ));
    link.setAttribute('download', name);

    // Append the Anchor tag in the actual web page or application
    document.body.appendChild(link);

    // Trigger the click event of the Anchor link
    link.click();

    // Remove the Anchor link form the web page or application
    document.body.removeChild(link);
}

//////////////////////////////////////////
// STRINGS ///////////////////////////////
//////////////////////////////////////////

export function stringRegex( string ) {
    return new RegExp(
        string.replace(/[-/\\^$*+?.()|[\]{}]/g, '\\$&'),
        'gi'
    );
}

export function paginate( items, {page, perPage}) {
    const pageNum = Number.parseInt(page);
    const perPageNum = Number.parseInt(perPage);

    return {
        total: items.length,
        page: pageNum,
        perPage: perPageNum,
        lastPage: Math.ceil(items.length/perPageNum),
        items,
    }
}

/**
 * Returns whether a value is undefined.
 * @ignore
 *
 * @param {} value - The value to test.
 *
 * @return {Boolean}
 */
export function isUndefined(value) {
    return typeof value === 'undefined'
}

/**
 * Returns an object flattened to one level deep.
 * @ignore
 *
 * @param {Object} object - The object to flatten.
 * @param {String} separator - The separator to use between flattened nodes.
 *
 * @return {Object}
 */
export function flattenObject(object, separator = '.') {
    const finalObject = {}
    Object.entries(object).forEach(item => {
        if (typeof item[1] === 'object') {
            const flatObject = flattenObject(item[1])
            Object.entries(flatObject).forEach(node => {
                finalObject[item[0] + separator + node[0]] = node[1]
            })
        } else {
            finalObject[item[0]] = item[1]
        }
    })
    return finalObject
}

/**
 * @param {float|int} val
 * @return {string}
 */
export function toPercentageString( val, decimalPlaces = 1 ) {
    let displayValue = val*100;
    return `${displayValue.toFixed(decimalPlaces)}%`
}