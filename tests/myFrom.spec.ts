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

    it('myFrom should support generic type', function () {
        const source$ = myFrom(['a', 'b', 'c']);

        const expected = ['a', 'b', 'c'];
        const actual: string[] = [];
        source$.subscribe(value => {
            actual.push(value);
        });
        expect(actual).toEqual(expected);
    });
});
