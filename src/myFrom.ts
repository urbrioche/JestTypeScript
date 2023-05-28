import {Observable} from 'rxjs';

export function myFrom() {
    const data = [1, 2, 3, 4, 5];
    const source$ = new Observable<number>(subscriber => {
        for (const value of data) {
            subscriber.next(value);
        }
    });
    return source$;
}
