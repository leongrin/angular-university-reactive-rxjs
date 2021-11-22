import { Injectable } from '@angular/core';
import {BehaviorSubject, Observable, of} from 'rxjs';
import {concatMap, finalize, tap} from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class LoadingService {

  private loadingSubject = new BehaviorSubject<boolean>(false);

  loading$: Observable<boolean> = this.loadingSubject.asObservable();

  constructor() { }

  showLoaderUntilCompleted<T>(obs$: Observable<T>): Observable<T> {
    return of(null)
      .pipe(
        tap(() => this.loadingOn()),
        concatMap(() => obs$),
        finalize(() => this.loadingOff())
      );
  }

  loadingOn() {
    console.log('loadingOn activated');
    this.loadingSubject.next(true);

  }

  loadingOff() {
    console.log('loadingOff activated');
    this.loadingSubject.next(false);

  }
}