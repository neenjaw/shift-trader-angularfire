import { Injectable }     from '@angular/core';
import { Headers, Http }  from '@angular/http';

//Rxjs
import { Observable } from 'rxjs/Observable';
import { Subscription } from 'rxjs/Subscription';
import 'rxjs/add/operator/toPromise';

//AngularFire2 Import Structure
import { AngularFireDatabase, FirebaseListObservable } from 'angularfire2/database';
import { AngularFireAuth } from 'angularfire2/auth';
import * as firebase from 'firebase/app';

import { User as ShiftTradeUser } from '../classes/user';

@Injectable()
export class ShiftTradeDataService {

  private userRef: string = '/users';
  private listedShiftRef: string = '/shifts';
  private requestedTradeRef: string = '/requested-trades';
  private acceptedTradeRef: string = '/accepted-trades';
  private appRef: string = '/app';

  //declarations for firebase usage
  private user: Observable<firebase.User>; //allows us to access the user state
  private userSub: Subscription;
  private userId: String;
  private isAnonymous: boolean;
  private items: FirebaseListObservable<any[]>; //stores the firebase list

  /**
   * [constructor description]
   * @param  {AngularFireAuth}     privateafAuth dependency injection
   * @param  {AngularFireDatabase} privateafData dependency injection
   * @return {[type]}                            [description]
   */
  constructor(private afAuth: AngularFireAuth, private afData: AngularFireDatabase) {
    this.items = afData.list('/messages', {
      query: {
        limitToLast: 50
      }
    });

    this.user = this.afAuth.authState;
  }

  /**
   * [authenticated description]
   * @return {boolean} [description]
   */
  public authenticated(): boolean {
    return this.user !== null;
  }

  /**
   * [getUser description]
   * @return {Observable<firebase.User>} [description]
   */
  public getUser(): Observable<firebase.User> {
    return this.user;
  }

  /**
   * [currentUserAnonymous description]
   * @return {boolean} [description]
   */
  public currentUserAnonymous(): boolean {
    return this.authenticated ? this.isAnonymous : false
  }

  /**
   * [currentUserDisplayName description]
   * @return {string} [description]
   */
  public currentUserDisplayName(): string {
    if (!this.user) { return 'Guest' }
    else if (this.currentUserAnonymous) { return 'Anonymous' }
    else { return this.user['displayName'] || 'User without a Name' }
  }

  /**
   * [getShifts description]
   * @return {FirebaseListObservable<any[]>} [description]
   */
  public getShifts(): FirebaseListObservable<any[]> {
    return this.afData.list(this.listedShiftRef, {});
  }

  /**
   * [anonymousLogin description]
   */
  public anonymousLogin(): void {
    this.afAuth.auth.signInAnonymously().then(() => {
      //create a subscription to the user's data
      this.subscribeToUserData();
    });
  }

  /**
   * [logout description]
   */
  public logout(): void {
    this.afAuth.auth.signOut().then(() => {
      //cancel the subscription to the user's data
      this.unsubscribeToUserData();
    });
  }

  /**
   * [subscribeToUserData description]
   */
  private subscribeToUserData(): void {
    this.userSub = this.user.subscribe(data => {
      //link the subscription to the class properties
      this.userId = data.uid;
      this.isAnonymous = data.isAnonymous;
    });
  }


  /**
   * [unsubscribeToUserData description]
   */
  private unsubscribeToUserData(): void {
    this.userSub.unsubscribe();
  }

  public sendMessage(desc: string): void {
    this.items.push({ message: desc });
  }

  public writeUserData(userId, name, email, phone): void {
    firebase.database().ref(this.userRef + userId).set({
      name: name,
      email: email,
      phone: phone
    });
  }

}
