import {calculateSumEqualsValue, combinationSetPositiveAndNegative} from "../../src/utils/numbers";
import {countFractionDigits} from "../../src/utils/numbers";

const nums = [1200000, 22, 1600, 1370, 1080];
const target = 1195928;

test('finds the subset of numbers to add to 10', () => {
    expect(calculateSumEqualsValue([6,4], 10)).toEqual([6,4]);
});

test('uses negatives', () => {
    expect(calculateSumEqualsValue([6,4], 2)).toEqual([6,-4]);
});

test('finds the subset of numbers to add to 1195928', () => {
    expect(calculateSumEqualsValue(nums, target)).toEqual([1200000,-22,-1600,-1370,-1080]);
});

test('combination sets for three numbers', () => {
    expect( combinationSetPositiveAndNegative([1, 2, 3]) ).toEqual([
        [1,2,3], [-1,-2,-3], [-1,2,3],[1,-2,-3],[1,-2,3],[-1,2,-3],[1,2,-3],[-1,-2,3]
    ]);
});

test('combination sets for two numbers', () => {
    expect( combinationSetPositiveAndNegative([45, 125]) ).toEqual([
        [45, 125], [-45, -125], [-45, 125], [45, -125]
    ]);
});

test('finds the subset of numbers to add to 3250', () => {
    expect(calculateSumEqualsValue([ 4500, 1250 ], 3250)).toEqual([4500,-1250]);
});

test("this one should work", () => {
    let numbers = [670, 790, 840, 20000, 2800, 30000, 13647, 13647, 5070, 3460];  // 909.24 subtotal
    let target = -90924;

    expect(calculateSumEqualsValue(numbers, target))
        .toEqual([-670, -790, -840, -20000, -2800, -30000, -13647, -13647, -5070, -3460]);
});

test('calculate decimal places in text correctly', () => {
    expect( countFractionDigits("1,000.00") ).toEqual(2);
    expect( countFractionDigits("100.00") ).toEqual(2);
    expect( countFractionDigits("1,000,000.00") ).toEqual(2);

    expect( countFractionDigits("1,000,000.001") ).toEqual(3);
    expect( countFractionDigits("100.001") ).toEqual(3);
    expect( countFractionDigits("1,000.001") ).toEqual(3);
})