import {Observable} from 'rxjs';

export function myFrom(data: number[]) {
    return new Observable<number>(subscriber => {
        for (const value of data) {
            subscriber.next(value);
        }
    });
}
