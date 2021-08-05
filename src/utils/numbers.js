
export const isNumeric = value => !isNaN(parseInt(value)) && isFinite(value);

export const isPercentage = percentage => isNumeric(percentage) && percentage <= 100 && percentage >= 0;

export const isEven = value => value % 2 === 0;

export const isFloat = value => isNumeric(value) && !Number.isInteger(value);

export const countFractionDigits = (number = 0) => {
    const fractionDigits = number.toString().split('.')[1]
    return fractionDigits ? fractionDigits.length : 0
};

export const isHalf = number => Math.abs(number) % 1 === 0.5;

export const formatNumber = value => new Intl.NumberFormat().format(value);

export const isInt = value => Number.isInteger(value);

export const toInt = value => ~~value;

export const assertInt = (...values) => {
    values.forEach( val => {
        if( ! isInt(val) ) {
            throw new Error( val + ' is not an integer');
        }
    })
};

export const combinationSetPositiveAndNegative = arr => {

    // the set of [] is [[]]
    if(arr.length === 0) {
        return [[]];
    }

    let set = [];

    // Numbers with sign as they are
    set.push( arr );

    // Numbers with sign reversed
    set.push( arr.map( (i) => i * -1 ) );

    if( arr.length > 1 ) {
        for (let i = 0; i < arr.length; i++) {

            // reverse sign of the `i` value and leave others as they are
            set.push(arr.map((val, j) => {
                return i === j ? val * -1 : val;
            }));

            // leave `i` value and reverse sign of all other in array
            set.push(arr.map((val, j) => {
                return i === j ? val : val * -1;
            }));

            // causes duplicates
            if(arr.length === 2) {
                break;
            }
        }
    }

    return set;
};

export const combinationsToSumTarget = (numbers, target) => {

    let n = numbers.length;

    // Iterate for all combinations
    for (let i = 0; i < (1 << n); i++)
    {
        let sum = 0;
        let combo = [];

        // Initially 100 in binary if n is 3
        // as 1<<(3-1) = 100 in binary
        let num = 1 << (n - 1);

        // Iterate in the array and assign
        // signs to the array elements
        for (let j = 0; j < n; j++)
        {
            // If the j-th bit from left
            // is set take '+' sign
            if (i & num) {
                combo.push(numbers[j]);
                sum += numbers[j];
            }
            else {
                combo.push(numbers[j] * -1);
                sum += (-1 * numbers[j]);
            }

            // Right shift to check if
            // jth bit is set or not
            num = num >> 1;
        }

        if (sum === target)
        {
            return combo;
        }
    }

    return [];
};

export const calculateSumEqualsValue = (array, target) => {

    try {
        assertInt(...array);
        assertInt( target );
    }
    catch(e) {
        throw new Error('only integer values can be used to calculate a combination to sum: ' + e.message);
    }

    // Find the combination that sums to match the target
    return combinationsToSumTarget( array, target );
};