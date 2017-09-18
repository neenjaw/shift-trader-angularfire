import { Injectable }     from '@angular/core';
import { Headers, Http }  from '@angular/http';

//Rxjs
import { Observable } from 'rxjs/Observable';
import { Subscription } from 'rxjs/Subscription';
import 'rxjs/add/operator/toPromise';
import 'rxjs/add/operator/take';

//AngularFire2 Import Structure
import { AngularFireDatabase, FirebaseListObservable, FirebaseObjectObservable } from 'angularfire2/database';
import { AngularFireAuth } from 'angularfire2/auth';
import * as firebase from 'firebase/app';

import * as moment from 'moment';

import { User as ShiftUser } from '../classes/user';
import { Shift } from '../classes/shift';
import { ShiftDate } from '../classes/shift-date';

@Injectable()
export class ShiftTradeDataService {

  private userRef: string = 'users';
  private listedShiftRef: string = 'shifts';
  private requestedTradeRef: string = 'requested-trades';
  private acceptedTradeRef: string = 'accepted-trades';
  private appRef: string = 'app';

  //declarations for firebase auth usage
  private user: Observable<firebase.User>; //allows us to access the current user state
  private latestUser: firebase.User;
  private userSub: Subscription; //access the subscriptions to the user data

  //declarations for firebase database usage
  private listedShifts: FirebaseListObservable<any[]>; //stores the firebase list
  private listedShiftsSub: Subscription;
  private latestListedShifts: any[];

  private requestedTrades: FirebaseListObservable<any[]>; //stores the firebase list
  private requestedTradesSub: Subscription;
  private latestRequestedTrades: any[];


  private acceptedTrades: FirebaseListObservable<any[]>; //stores the firebase list
  private acceptedTradesSub: Subscription;
  private latestAcceptedTrades: any[];


  private appUsers: FirebaseListObservable<any[]>; //stores the firebase list
  private appUsersSub: Subscription;
  private latestAppUsers: any[];


  /**
   * Shift Trade Data Service constructor
   * @param  {AngularFireAuth}     privateafAuth dependency injection
   * @param  {AngularFireDatabase} privateafData dependency injection
   * @return {[type]}                            [description]
   */
  constructor(private afAuth: AngularFireAuth, private afData: AngularFireDatabase) {
    this.subscribeToAuthUser();

    this.subscribeToListedShifts();

    this.subscribeToRequestedTrades();

    this.subscribeToAcceptedTrades();

    this.subscribeToAppUsers();
  }

  /**
   * Function subscribes to Observable<firebase.User>, updates latestUser whenever a new user is generated.
   */
  private subscribeToAuthUser(): void {
    this.user = this.afAuth.authState;

    this.userSub = this.user.subscribe(u => {
      this.latestUser = u;
    });
  }

  /**
   * [desc]
   */
  private subscribeToListedShifts(): void {
    this.listedShifts = this.afData.list(`/${this.listedShiftRef}`);

    this.listedShiftsSub = this.listedShifts.subscribe(lShift => {
      this.latestListedShifts = lShift;
      console.log(`Listed Shifts:`);
      console.log(this.latestListedShifts);
    });
  }

  /**
   * [desc]
   */
  private subscribeToRequestedTrades(): void {
    this.requestedTrades = this.afData.list(`/${this.requestedTradeRef}`);

    this.requestedTradesSub = this.requestedTrades.subscribe(rTrade => {
      this.latestRequestedTrades = rTrade;
      console.log(`Requested Trades:`);
      console.log(this.latestRequestedTrades);
    });
  }

  /**
   * [desc]
   */
  private subscribeToAcceptedTrades(): void {
    this.acceptedTrades = this.afData.list(`/${this.acceptedTradeRef}`);

    this.acceptedTradesSub = this.acceptedTrades.subscribe(aTrade => {
      this.latestAcceptedTrades = aTrade;
      console.log(`Accepted Trades:`);
      console.log(this.latestAcceptedTrades);
    });
  }

  /**
   * [desc]
   */
  private subscribeToAppUsers(): void {
    this.appUsers = this.afData.list(`/${this.userRef}`);

    this.appUsersSub = this.appUsers.subscribe(aUsr => {
      this.latestAppUsers = aUsr;
      console.log(`App Users:`);
      console.log(this.latestAppUsers);
    });
  }

  /**
   * [anonymousLogin description]
   */
  public anonymousLogin(): void {
    this.afAuth.auth.signInAnonymously();
  }

  /**
   * [emailLogin description]
   * @param  {string} email    [description]
   * @param  {string} password [description]
   * @return {[type]}          [description]
   */
  public emailLogin(email:string, password:string) {
     return this.afAuth.auth.signInWithEmailAndPassword(email, password)
       .catch(error => console.log(error));
  }

  /**
   * [logout description]
   */
  public logout(): void {
    this.afAuth.auth.signOut().then(() => {});
  }

  /**
   * Function that allows true/false evaluation of current authentication status
   * @return {boolean} True: Current logged in to firebase, False: not currently logged in
   */
  public authenticated(): boolean {
    return (firebase.auth().currentUser !== null);
  }

  /**
   * Returns the reference to the Observable<firebase.User>
   * @return {Observable<firebase.User>} Emits firebase.User as it updates
   */
  public currentUserObservable(): Observable<firebase.User> {
    return this.user;
  }

  /**
   * Returns boolean value representing current anonymous login status
   * @return {boolean} [True: yes, is anonymous; False: no, not anonymous]
   */
  public currentUserAnonymous(): boolean {
    return this.authenticated() ? this.latestUser.isAnonymous : false;
  }

  /**
   * Returns current user's uid, if not logged in, returns blank
   * @return {string} Current user's uid
   */
  public currentUserId(): string {
    return this.authenticated() ? this.latestUser.uid : '';
  }

  /**
   * Returns the current user's displayName
   * @return {string} [description]
   */
  public currentUserDisplayName(): string {
    if (!this.authenticated()) { return 'Guest' }
    else if (this.currentUserAnonymous()) { return 'Anonymous' }
    else { return this.latestUser.displayName || 'User without a Name' }
  }

  /**
   * [getShifts description]
   * @return {FirebaseListObservable<any[]>} [description]
   */
  public getShifts(): any[] {
    return this.latestListedShifts;
  }

  /**
   * [createListedShift description]
   * @param  {string}        date [description]
   * @param  {string}        uid  [description]
   * @return {Promise<void>}      [description]
   */
  public addListedShift(date: ShiftDate, uid: string): void {
    try {
      let update = {};

      //check if the record already exists
      this.afData.object(`/${this.listedShiftRef}/${date.toString()}/${uid}`).take(1).subscribe(s => {
        if (s.$exists()) {

          //if it exists
          throw new Error('Shift already listed for this user');

        } else {

          //update the shift listing
          update[`${this.listedShiftRef}/${date.toString()}/${this.latestUser.uid}`] = true;
          //update the user's shifts
          update[`${this.userRef}/${this.latestUser.uid}/shifts/${date.toString()}`] = true;
          //run the update on firebase
          this.afData.object('/').update(update).catch(e => { throw e });
        }
      });
    } catch (e) {
      console.log(`Error creating listed shift - ${e}`)
    }
  }

  public removeListedShift(date: ShiftDate, uid: string): void {
    try {
      //check if the record already exists
      this.afData.object(`/${this.listedShiftRef}/${date.toString()}/${uid}`).take(1).subscribe(s => {
        if (!s.$exists()) {

          //if it doesn't exist
          throw new Error('Shift not listed for this user');

        } else {

          this.afData.object(`/${this.listedShiftRef}/${date.toString()}/${uid}`).set(null).catch(e => { throw e });
          this.afData.object(`/${this.userRef}/${uid}/shifts/${date.toString()}`).set(null).catch(e => { throw e });

        }
      });
    } catch (e) {
      console.log(`Error removing listed shift - ${e}`);
    }
  }

  public writeUserData(userId, name, email, phone): void {
    firebase.database().ref(`/${this.userRef}/${userId}`).set({
      name: name,
      email: email,
      phone: phone
    });
  }

}
