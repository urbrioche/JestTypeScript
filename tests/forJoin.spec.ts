import {forkJoin, Observable, Subject} from 'rxjs';
import {TestScheduler} from 'rxjs/internal/testing/TestScheduler';

describe('forkJoin', () => {
    let testScheduler: TestScheduler;
    beforeEach(() => {
        testScheduler = new TestScheduler((actual, expected) => {
            expect(actual).toEqual(expected);
        });
    });

    it('forkJoin Cold Observables', () => {
        const data1$ = new Observable<number>((subscriber) => {
            subscriber.next(1);
            subscriber.next(2);
            subscriber.next(3);
            subscriber.complete();
        });

        const data2$ = new Observable<string>((subscriber) => {
            subscriber.next('A');
            subscriber.next('B');
            subscriber.complete();
        });

        let actual: [number, string];

        forkJoin([data1$, data2$]).subscribe({
            next: (data) => {
                actual = data;
            },
            complete: () => {
                expect(actual).toBe([3, 'B']);
            },
        });
    });

    it('forkJoin Hot Observables should never emit value', () => {
        // this case should use marble test
        testScheduler.run(helpers => {
            const {hot, expectObservable} = helpers;
            const data1$ = hot('-1-2-');
            const data2$ = hot('-A-B');
            const e$ = forkJoin([data1$, data2$]);
            const expected = '-';

            expectObservable(e$).toBe(expected);
        });

        /*
        const data1$ = new Subject<number>();

        const data2$ = new Subject<string>();

        forkJoin([data1$, data2$]).subscribe({
            next: (data) => console.log(data),
            complete: () => console.log('complete'),
        });

        data1$.next(1);
        data1$.next(2);

        data2$.next('A');
        data2$.next('B');
         */
    });

    it('forkJoin Hot Observables should emit value when all complete ', () => {
        const data1$ = new Subject<number>();

        const data2$ = new Subject<string>();
        let actual: [number, string];
        forkJoin([data1$, data2$]).subscribe({
            next: (data) => {
                actual = data;
            },
            complete: () => {
                expect(actual).toBe([2, 'B']);
            },
        });

        data1$.next(1);
        data1$.next(2);
        data1$.complete();

        data2$.next('A');
        data2$.next('B');
        data2$.complete();
    });

    it('forkJoin Hot Observables should emit value when all complete using marble', () => {
        testScheduler.run(helpers => {
            const {hot, expectObservable} = helpers;
            const data1$ = hot('-1-2-|');
            const data2$ = hot('-A-B-|');
            const e$ = forkJoin([data1$, data2$]);
            const expected = '-----(x|)';

            expectObservable(e$).toBe(expected, {x: ["2", 'B']});
        });
    });


});
