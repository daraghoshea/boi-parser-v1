import {textToAmount} from "../../src/utils/money";

test('text numbers are converted to integers', () => {
    expect( textToAmount("1,000.00") ).toBe(100000);
    expect( textToAmount("1,234.56") ).toBe(123456);
    expect( textToAmount("1,234") ).toBe(123400);
});