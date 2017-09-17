import { Injectable }     from '@angular/core';
import { Headers, Http }  from '@angular/http';

//Rxjs
import { Observable } from 'rxjs/Observable';
import { Subscription } from 'rxjs/Subscription';
import 'rxjs/add/operator/toPromise';

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

  private userRef: string = '/users';
  private listedShiftRef: string = '/shifts';
  private requestedTradeRef: string = '/requested-trades';
  private acceptedTradeRef: string = '/accepted-trades';
  private appRef: string = '/app';

  //declarations for firebase auth usage
  private user: Observable<firebase.User>; //allows us to access the current user state
  private latestUser: firebase.User;
  private userSub: Subscription; //access the subscriptions to the user data

  //declarations for firebase database usage
  private listedShifts: FirebaseListObservable<any[]>; //stores the firebase list
  private listedShiftsSub: Subscription;
  private latestListedShifts: any[];

  private requestedTrades: FirebaseListObservable<any[]>; //stores the firebase list
  private acceptedTrades: FirebaseListObservable<any[]>; //stores the firebase list
  private appUsers: FirebaseListObservable<any[]>; //stores the firebase list

  /**
   * Shift Trade Data Service constructor
   * @param  {AngularFireAuth}     privateafAuth dependency injection
   * @param  {AngularFireDatabase} privateafData dependency injection
   * @return {[type]}                            [description]
   */
  constructor(private afAuth: AngularFireAuth, private afData: AngularFireDatabase) {
    this.user = this.afAuth.authState;
    this.subscribeToAuthUser();

    this.requestedTrades = null;
    this.acceptedTrades = null;
    this.appUsers = null;

    this.listedShifts = afData.list(this.listedShiftRef);
    this.subscribeToListedShifts();
  }

  /**
   * Function subscribes to Observable<firebase.User>, updates latestUser whenever a new user is generated.
   */
  private subscribeToAuthUser(): void {
    this.userSub = this.user.subscribe(u => {
      this.latestUser = u;
    });
  }

  /**
   * [desc]
   */
  private subscribeToListedShifts(): void {
    this.listedShiftsSub = this.listedShifts.subscribe(lShift => {
      this.latestListedShifts = lShift;
      console.log(this.latestListedShifts);
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
  public createListedShift(date: ShiftDate, uid: string): Promise<void> {
    try {
      return <Promise<void>> this.afData.object(`${this.listedShiftRef}/${date.toString()}/${this.latestUser.uid}`).set(true);
    } catch (e) {
      console.log(e);
    } finally {
      return null;
    }
  }

  public writeUserData(userId, name, email, phone): void {
    firebase.database().ref(this.userRef +'/'+ userId).set({
      name: name,
      email: email,
      phone: phone
    });
  }

}

// let foo: FirebaseObjectObservable<any> = this.afData.object(`${this.listedShiftRef}/${date}`);
//
// foo.subscribe(x => {
//    console.log(x);
//   if (x.$exists()){
//         console.log(`FOUND`,x);
//   } else {
//         console.log(`NOT FOUND`);
//   }
// });
//
// foo.set({ [`jjjjjjj${this.latestUser.uid}`] : true})
