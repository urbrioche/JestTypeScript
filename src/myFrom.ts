import {Observable} from 'rxjs';

export function myFrom(data: number[]) {
    const source$ = new Observable<number>(subscriber => {
        for (const value of data) {
            subscriber.next(value);
        }
    });
    return source$;
}
