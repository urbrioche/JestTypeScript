import {Observable, ReplaySubject, share, Subject, Subscriber, tap} from 'rxjs';

describe('share', () => {
    it('use share to multi cast cold observable should not working', () => {
        let actualCalled = 0;
        const data1$ = new Observable<number>((subscriber: Subscriber<number>) => {
            actualCalled++;
            console.log('start');
            subscriber.next(1);
            subscriber.next(2);
            subscriber.next(3);
            subscriber.next(4);
            subscriber.next(5);
            subscriber.complete();
        });

        //https://www.bitovi.com/blog/always-know-when-to-use-share-vs.-sharereplay
        // cold observable 不如預期，似乎要用shareReplay
        const dataShare$ = data1$.pipe(share());
        // 預期結果 data$內的subscriber只會進入一次，所以，理論上start...end 只會出現一次
        // 但是，結果卻是出現兩次

        // 下面的程式是同步行為
        // 先跑這
        dataShare$.subscribe({
            next: (data) => console.log(data),
            complete: () => console.log('complete'),
        });

        // 再跑這
        console.log('**********');

        // 最後跑這
        dataShare$.subscribe({
            next: (data) => console.log(data),
            complete: () => console.log('complete'),
        });

        // 看一下這段原始嗎，就不難理解為什麼會不如預期了
        // https://github.com/ReactiveX/rxjs/blob/3d69bbc1e95957e65c22984f4e795ff4ca9e4628/src/internal/operators/share.ts#L203
        // 結果是call 2 次，而不是 1 次
        expect(actualCalled === 1).toBeFalsy();
        expect(actualCalled).toBe(2);
    });

    it('use share to multi cast cold observable with ReplaySubject should be working', () => {
        let actualCalled = 0;
        const data1$ = new Observable<number>((subscriber) => {
            actualCalled++;
            console.log('start');
            subscriber.next(1);
            subscriber.next(2);
            subscriber.next(3);
            subscriber.next(4);
            subscriber.next(5);
            subscriber.complete();
            console.log('end');
        });

        //https://www.bitovi.com/blog/always-know-when-to-use-share-vs.-sharereplay
        // cold observable 不如預期，似乎要用shareReplay
        const dataShare$ = data1$.pipe(
            share({resetOnComplete: false, connector: () => new ReplaySubject()})
        );
        // 預期結果 data$內的subscriber只會進入一次，所以，start...end 只會出現一次

        // 下面的程式是同步行為
        // 先跑這，跑完資料流會complete，藉由resetOnComplete:false 來解決
        dataShare$.subscribe({
            next: (data) => console.log(data),
            complete: () => console.log('complete'),
        });

        // 再跑這
        console.log('**********');

        // 最後跑這
        // 將connector改為 replaySubject 解決這段內部的subject的訂閱，是在emit事件後 (很抽象，多看原始嗎才能理解)
        dataShare$.subscribe({
            next: (data) => console.log(data),
            complete: () => console.log('complete'),
        });

        expect(actualCalled).toBe(1);
    });

    it('use share to multi cast hot observable', () => {
        let actualCalled = 0;
        const data$ = new Subject<number>();

        const dataShare$ = data$.pipe(
            tap(() => {
                actualCalled++;
                console.log('should only enter once when each value emit');
            }),
            share()
        );

        dataShare$.subscribe({
            next: (value) => {
                console.log(value);
            },
            complete: () => {
                console.log('complete');
            },
        });

        dataShare$.subscribe({
            next: (value) => {
                console.log(value);
            },
            complete: () => {
                console.log('complete');
            },
        });

        data$.next(123);

        expect(actualCalled).toBe(1);
    });

    it('share should work on late subscribe scenario', (done) => {
        let actualCalled = 0;
        // 模擬http請求
        const getData = (): Observable<string[]> => {
            return new Observable<string[]>((subscriber) => {
                console.log('getData...');
                actualCalled++;
                // 2秒後資料回來
                setTimeout(() => {
                    subscriber.next(['John', 'Hulk']);
                    subscriber.complete();
                }, 2000);
            });
        };

        const dataShare$ = getData().pipe(
            share()
        );
        dataShare$.subscribe({
            next: (data) => console.log(data),
            complete: () => console.log('complete'),
        });

        console.log('**********');

        dataShare$.subscribe({
            next: (data) => console.log(data),
            complete: () => console.log('complete'),
        });

        // late subscribe after 1 seconds, but api call take 2 seconds
        // 主要是網路上有一些文章用setTimeout來解說late subscribe不會share()
        // 但，其實要看是“多晚”訂閱
        // 像這種情形是有share的
        // getData...只出現一次
        setTimeout(() => {
            dataShare$.subscribe({
                next: (data) => console.log(data),
                complete: () => {
                    console.log('complete-done', actualCalled);
                    expect(actualCalled).toBe(1);
                    done();
                },
            });
        }, 1000);
    });

    it('share should not work on late subscribe scenario', (done) => {
        let actualCalled = 0;
        // 模擬http請求
        const getData = (): Observable<string[]> => {
            return new Observable<string[]>((subscriber) => {
                console.log('getData...');
                actualCalled++;
                // 2秒後資料回來
                setTimeout(() => {
                    subscriber.next(['John', 'Hulk']);
                    subscriber.complete();
                }, 2000);
            });
        };

        const dataShare$ = getData().pipe(
            share()
        );
        dataShare$.subscribe({
            next: (data) => console.log(data),
            complete: () => console.log('complete'),
        });

        console.log('**********');

        dataShare$.subscribe({
            next: (data) => console.log(data),
            complete: () => console.log('complete'),
        });

        // late subscribe after 2.5 seconds, but api call take 2 seconds
        // 主要是網路上有一些文章用setTimeout來解說late subscribe不會share()
        // 但，其實要看是“多晚”訂閱
        // 像這種情形是不會share的
        // getData...只會出現兩次
        setTimeout(() => {
            dataShare$.subscribe({
                next: (data) => console.log(data),
                complete: () => {
                    console.log('complete');
                    expect(actualCalled).toBe(2);
                    done();
                },
            });
        }, 2500);
    });
});
