import { Component, OnInit } from '@angular/core';

//Rxjs
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/toPromise';

import * as firebase from 'firebase/app';

import { ShiftTradeDataService } from './services/shift-trade-data.service'
import { ShiftDate } from './classes/shift-date';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'app';
  user: Observable<firebase.User>;

  // THIS IS A TEST TO MAKE SURE THE CODE IS WORKING WITH USING THE SERVICE

  constructor(private stData: ShiftTradeDataService) {
    this.user = stData.currentUserObservable();
  }

  public isAnonymous(): boolean {
    return this.stData.currentUserAnonymous();
  }

  public getUserId(): string {
    return this.stData.currentUserId();
  }

  public getUserName(): string {
    return this.stData.currentUserDisplayName();
  }

  public anonLogin(): void {
    this.stData.anonymousLogin();
  }

  public emailLogin(email: string, password: string): void {
    this.stData.emailLogin(email, password);
  }

  public logout(): void {
    this.stData.logout();
  }

  public listNewShift(date: string) {
    let d: string[] = date.split('-');

    this.stData.createListedShift(new ShiftDate(`${d[0]}-${d[1]}-${d[2]}`,d[3]), this.stData.currentUserId());
  }

  ngOnInit() {
  }
}
