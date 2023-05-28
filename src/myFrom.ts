import {Observable} from 'rxjs';

export function myFrom() {
    const source$ = new Observable<number>(subscriber => {
        subscriber.next(1);
        subscriber.next(2);
        subscriber.next(3);
        subscriber.next(4);
        subscriber.next(5);
    });
    return source$;
}
