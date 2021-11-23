import { Injectable } from '@angular/core';
import {BehaviorSubject, Observable, of} from 'rxjs';
import {User} from '../model/user';
import {HttpClient} from '@angular/common/http';
import {catchError, map, shareReplay, tap} from 'rxjs/operators';
import {MessagesService} from './messages.service';

const AUTH_DATA = 'user-auth-data';
@Injectable({
  providedIn: 'root'
})
export class AuthStoreService {

  private userSubject = new BehaviorSubject<User>(null);
  user$: Observable<User> = this.userSubject.asObservable();

  loggedIn$: Observable<boolean>;
  loggedOut$: Observable<boolean>;

  constructor(private http: HttpClient,
              private messageServ: MessagesService) {
    /*THIS CONSTRUCTOR IS BEING CALLED ON APP START UP BECAUSE THIS SERVICE IS ON THE CONSTRUCTOR OF APP.COMPONENT.TS*/

    this.loggedIn$ = this.user$.pipe(map(userData => !!userData));  // converts to true if the user exists
    this.loggedOut$ = this.loggedIn$.pipe(map(bool => !bool));

    const user = localStorage.getItem(AUTH_DATA);
    if (user) {
      this.userSubject.next(JSON.parse(user));
    }

  }


  login(email: string, password: string): Observable<User> {
    return this.http.post<User>('/api/login', {email, password})
      .pipe(
        tap(user => {
          this.userSubject.next(user);
          localStorage.setItem(AUTH_DATA, JSON.stringify(user));
        }),
        catchError(err => {
          const msg = 'Invalid username or password. Please try again.';
          console.log(msg, err);
          this.messageServ.showErrors(msg);
          return of(err);
        }),
        shareReplay()
      );
  }

  logout() {
    this.userSubject.next(null);
    localStorage.removeItem(AUTH_DATA);
  }

}
