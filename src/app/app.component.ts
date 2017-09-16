import { Component, OnInit } from '@angular/core';

//Rxjs
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/toPromise';

import * as firebase from 'firebase/app';

import { ShiftTradeDataService } from './services/shift-trade-data.service'

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'app';
  user: Observable<firebase.User>;
  userId: string;

  // THIS IS A TEST TO MAKE SURE THE CODE IS WORKING WITH USING THE SERVICE

  constructor(private shiftTradeDataService: ShiftTradeDataService) {
    this.user = shiftTradeDataService.getUser();
    //this.userId = shiftTradeDataService.getUserId();
  }

  public isAnonymous(): boolean {
    return this.shiftTradeDataService.currentUserAnonymous();
  }

  public getUserName(): string {
    return this.shiftTradeDataService.currentUserDisplayName();
  }

  public anonLogin(): void {
    this.shiftTradeDataService.anonymousLogin();
  }

  public logout(): void {
    this.shiftTradeDataService.logout();
  }

  ngOnInit() {
  }
}
