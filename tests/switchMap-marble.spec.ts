import {map, switchMap} from 'rxjs';
import {TestScheduler} from 'rxjs/internal/testing/TestScheduler';

describe('switchMap', () => {
    let testScheduler: TestScheduler;
    beforeEach(() => {
        testScheduler = new TestScheduler((actual, expected) => {
            expect(actual).toEqual(expected);
        });
    });

    it('simple hot observable-marble', () => {
        // https://dev.to/this-is-learning/rxjs-marble-testing-2gg9
        testScheduler.run((helpers) => {
            const {hot, expectObservable} = helpers;
            const source$ = hot('-a-b-^-c|');
            const expected = '--c|';
            expectObservable(source$).toBe(expected);
        });
    });

    it('cold observable switchMap hot observable-marble', () => {
        testScheduler.run(helpers => {
            const {cold, hot, expectObservable} = helpers;
            const data$ = cold('123|');
            const people$ = hot('ab^--cd', {a: 'Mary', b: 'John', c: 'Iron Man', d: 'Captain America'});
            const result = data$.pipe(
                switchMap((no) => people$.pipe(map((person) => `${no}:${person}`)))
            );
            expectObservable(result).toBe('---cd', {c: '3:Iron Man', d: '3:Captain America'});
        });
    });

    it('cold observable switchMap cold observable-marble', () => {
        testScheduler.run(helpers => {
            const {cold, expectObservable} = helpers;
            const num: string = '   1--2--3|';
            const people: string = 'ab|';
            const data$ = cold(num);
            const people$ = cold(people, {a: 'Iron Man', b: 'Captain America'});
            const result = data$.pipe(
                switchMap((no) => people$.pipe(map((person) => `${no}:${person}`)))
            );
            expectObservable(result).toBe('uv-wx-yz|', {
                u: '1:Iron Man', v: '1:Captain America',
                w: '2:Iron Man', x: '2:Captain America',
                y: '3:Iron Man', z: '3:Captain America',
            });
        });
    });

    it('cold observable switchMap cold observable-marble-2', () => {
        testScheduler.run(helpers => {
            const {cold, expectObservable} = helpers;
            const num: string = '   123|';
            const people: string = 'ab|';
            const data$ = cold(num);
            const people$ = cold(people, {a: 'Iron Man', b: 'Captain America'});
            const result = data$.pipe(
                switchMap((no) => people$.pipe(map((person) => `${no}:${person}`)))
            );
            expectObservable(result).toBe('uwyz|', {
                u: '1:Iron Man', v: '1:Captain America',
                w: '2:Iron Man', x: '2:Captain America',
                y: '3:Iron Man', z: '3:Captain America',
            });
        });
    });
    //
    // it('cold observable switchMap async cold observable', done => {
    //     const expected: string[] = [];
    //     const data$ = new Observable<number>((subscriber) => {
    //         subscriber.next(1);
    //         subscriber.next(2);
    //         subscriber.next(3);
    //         subscriber.complete();
    //     });
    //
    //     const people$ = new Observable<string>((subscriber) => {
    //         setTimeout(() => {
    //             subscriber.next('Iron Man');
    //             // subscriber.next('Captain America');
    //         }, 500);
    //
    //         setTimeout(() => {
    //             // subscriber.next('Iron Man');
    //             subscriber.next('Captain America');
    //         }, 600);
    //
    //         setTimeout(() => {
    //             subscriber.complete();
    //         }, 700);
    //     });
    //
    //     data$.pipe(
    //         tap((no) => console.log(no)),
    //         switchMap((no) => people$.pipe(map((person) => `${no}:${person}`)))
    //     ).subscribe({
    //         next: (person) => {
    //             // console.log(`coldObservableSwitchMapAsyncColdObservable: ${person}`);
    //             expected.push(person);
    //         },
    //         complete: () => {
    //             //done();
    //             const actual: string[] = [
    //                 '3:Iron Man',
    //                 '3:Captain America',
    //             ];
    //             expect(actual).toEqual(expected);
    //             done();
    //         }
    //     });
    // });

});
