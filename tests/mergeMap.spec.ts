import {map, mergeMap, Observable, Subject} from 'rxjs';

describe('mergeMap', () => {
    it('cold observable mergeMap hot observable', () => {
        const actual: string[] = [];
        const data$ = new Observable<number>((subscriber) => {
            subscriber.next(1);
            subscriber.next(2);
            subscriber.next(3);
            subscriber.complete();
        });

        const people$ = new Subject<string>();
        people$.next('Mary');
        people$.next('John');

        data$.pipe(
            mergeMap((no) => people$.pipe(map((person) => `${no}:${person}`)))
        ).subscribe((person) => {
            actual.push(person);
            // console.log(`coldObservableMergeMapHotObservable: ${person}`);
        });

        people$.next('Iron Man');
        people$.next('Captain America');
        const expected = [
            '1:Iron Man', '2:Iron Man', '3:Iron Man',
            '1:Captain America', '2:Captain America', '3:Captain America',
        ];
        expect(actual).toEqual(expected);
    });

    it('hot observable mergeMap cold observable', () => {
        const actual: string[] = [];
        const data$ = new Observable<number>((subscriber) => {
            subscriber.next(1);
            subscriber.next(2);
            subscriber.next(3);
            subscriber.complete();
        });

        const people$ = new Subject<string>();
        people$.next('Mary');
        people$.next('John');

        people$.pipe(
            mergeMap((person) => data$.pipe(map((no) => `${no}:${person}`)))
        ).subscribe((person) => {
            actual.push(person);
            // console.log(`coldObservableMergeMapHotObservable: ${person}`);
        });

        people$.next('Iron Man');
        people$.next('Captain America');
        const expected = [
            '1:Iron Man',
            '2:Iron Man',
            '3:Iron Man',
            '1:Captain America',
            '2:Captain America',
            '3:Captain America',
        ];
        expect(actual).toEqual(expected);
    });


    it('cold observable mergeMap cold observable', () => {
        const actual: string[] = [];
        const data$ = new Observable<number>((subscriber) => {
            subscriber.next(1);
            subscriber.next(2);
            subscriber.next(3);
            subscriber.complete();
        });

        const people$ = new Observable<string>((subscriber) => {
            subscriber.next('Iron Man');
            subscriber.next('Captain America');
            subscriber.complete();
        });

        data$.pipe(
            mergeMap((it) => people$.pipe(map((person) => `${it}:${person}`)))
        ).subscribe((person) => {
            actual.push(person);
            // console.log(`coldObservableMergeMapColdObservable: ${person}`);
        });
        const expected = [
            '1:Iron Man', '1:Captain America',
            '2:Iron Man', '2:Captain America',
            '3:Iron Man', '3:Captain America',
        ];
        expect(actual).toEqual(expected);
    });

});
