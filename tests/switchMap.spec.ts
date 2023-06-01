import {map, Observable, Subject, switchMap, tap} from 'rxjs';

describe('switchMap', () => {
    it('cold observable switchMap hot observable', () => {
        const expected: string[] = [];
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
            switchMap((no) => people$.pipe(map((person) => `${no}:${person}`)))
        ).subscribe({
            next: (person) => {
                // console.log(`coldObservableSwitchMapHotObservable: ${person}`);
                expected.push(person);
            }
        });

        people$.next('Iron Man');
        people$.next('Captain America');

        const actual = ['3:Iron Man', '3:Captain America'];
        expect(actual).toEqual(expected);
    });

    it('cold observable switchMap cold observable', () => {
        const expected: string[] = [];
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
            switchMap((no) => people$.pipe(map((person) => `${no}:${person}`)))
        ).subscribe({
            next: (person) => {
                // console.log(`coldObservableSwitchMapColdObservable: ${person}`);
                expected.push(person);
            }
        });

        const actual = [
            '1:Iron Man', '1:Captain America',
            '2:Iron Man', '2:Captain America',
            '3:Iron Man', '3:Captain America',
        ];
        expect(actual).toEqual(expected);
    });

    it('cold observable switchMap async cold observable', done => {
        const expected: string[] = [];
        const data$ = new Observable<number>((subscriber) => {
            subscriber.next(1);
            subscriber.next(2);
            subscriber.next(3);
            subscriber.complete();
        });

        const people$ = new Observable<string>((subscriber) => {
            setTimeout(() => {
                subscriber.next('Iron Man');
                // subscriber.next('Captain America');
            }, 500);

            setTimeout(() => {
                // subscriber.next('Iron Man');
                subscriber.next('Captain America');
            }, 600);

            setTimeout(() => {
                subscriber.complete();
            }, 700);
        });

        data$.pipe(
            tap((no) => console.log(no)),
            switchMap((no) => people$.pipe(map((person) => `${no}:${person}`)))
        ).subscribe({
            next: (person) => {
                // console.log(`coldObservableSwitchMapAsyncColdObservable: ${person}`);
                expected.push(person);
            },
            complete: () => {
                //done();
                const actual: string[] = [
                    '3:Iron Man',
                    '3:Captain America',
                ];
                expect(actual).toEqual(expected);
                done();
            }
        });
    });


});
