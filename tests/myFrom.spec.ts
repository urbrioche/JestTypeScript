import {Observable} from 'rxjs';

describe('myFrom', () => {
    it('myFrom should return value when subscribe', function () {
        const source$ = new Observable<number>(subscriber => {
            subscriber.next(1);
            subscriber.next(2);
            subscriber.next(3);
            subscriber.next(4);
            subscriber.next(5);
        });

        const expected = [1, 2, 3, 4, 5];
        const actual: number[] = [];
        source$.subscribe(value => {
            actual.push(value);
        });
        expect(actual).toEqual(expected);
    });
});
