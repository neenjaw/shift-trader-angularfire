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
  title: string = 'app';
  user: Observable<firebase.User> = null;

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
    this.stData.addListedShift(new ShiftDate(date), this.stData.currentUserId());
  }

  public removeShift(date: string) {
    this.stData.removeListedShift(new ShiftDate(date), this.stData.currentUserId());
  }

  public requestNewTrade(date: string, ror: string, ree: string, com: string) {
    this.stData.addRequestedTrade(new ShiftDate(date), ror, ree, com);
  }

  ngOnInit() {
  }
}
