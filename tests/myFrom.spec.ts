import {myFrom} from '../src/myFrom';

describe('myFrom', () => {
    it('myFrom should return value when subscribe', function () {
        const source$ = myFrom([1, 2, 3, 4, 5]);

        const expected = [1, 2, 3, 4, 5];
        const actual: number[] = [];
        source$.subscribe(value => {
            actual.push(value);
        });
        expect(actual).toEqual(expected);
    });
});
