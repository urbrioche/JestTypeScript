import {Observable} from 'rxjs';

export function myFrom<TData>(data: TData[]) {
    return new Observable<TData>(subscriber => {
        for (const value of data) {
            subscriber.next(value);
        }
    });
}
