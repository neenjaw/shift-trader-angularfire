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

import { ShiftUser } from '../classes/shift-user';
import { Shift } from '../classes/shift';
import { ShiftDate } from '../classes/shift-date';

@Injectable()
export class ShiftTradeDataService {

  private userRef: string = 'users';
  private listedShiftRef: string = 'shifts';
  private requestedTradeRef: string = 'requested-trades';
  private acceptedTradeRef: string = 'accepted-trades';
  private declinedTradeRef: string = 'declined-trades';
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

  private declinedTrades: FirebaseListObservable<any[]>; //stores the firebase list
  private declinedTradesSub: Subscription;
  private latestDeclinedTrades: any[];


  private appUsers: FirebaseListObservable<any[]>; //stores the firebase list
  private appUsersSub: Subscription;
  private latestAppUsers: any[];


  /**
   * Shift Trade Data Service constructor
   * @param  {AngularFireAuth}     privateafAuth dependency injection of the Auth Service
   * @param  {AngularFireDatabase} privateafData dependency injection of the Database service
   * @return {[type]}                            [description]
   */
  constructor(private afAuth: AngularFireAuth, private afData: AngularFireDatabase) {
    this.subscribeToAuthUser();

    this.subscribeToAppUsers();

    this.subscribeToListedShifts();

    //IDEA -- need to ponder.... do I need all of these latest__X__ objects? I am unsure.
    //Or should I just pass the observable reference and then treat it as a list in the model/view
    //I might just be making it more complicated than it should be and maybe it's okay to let the
    //other components be aware of the existence of the firebase db, but leave it to this service to
    //do the backend work...

    //FIXME This is all broken with the newest version, need to read how to migrate this
  }

  /**
   * Function subscribes to Observable<firebase.User>, updates latestUser whenever a new user is generated.
   */
  private subscribeToAuthUser(): void {
    this.user = this.afAuth.authState;

    this.userSub = this.user.subscribe(u => {
      this.latestUser = u;

      if (this.authenticated()) {
        this.subscribeToRequestedTrades(this.latestUser.uid);

        this.subscribeToAcceptedTrades(this.latestUser.uid);

        this.subscribeToDeclinedTrades(this.latestUser.uid);
      } else {
        this.unsubscribeToRequestedTrades();

        this.unsubscribeToAcceptedTrades();

        this.unsubscribeToDeclinedTrades();
      }
    });
  }

  /**
   * [desc]
   */
  private subscribeToAppUsers(): void { this.appUsers =
  this.afData.list(`/${this.userRef}`);

    this.appUsersSub = this.appUsers.subscribe(aUsr => {
      this.latestAppUsers = aUsr;
      console.log(`App Users:`);
      console.log(this.latestAppUsers);
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
  private subscribeToRequestedTrades(uid: String): void {
    this.requestedTrades = this.afData.list(`/${this.requestedTradeRef}/${uid}`);

    this.requestedTradesSub = this.requestedTrades.subscribe(rTrade => {
      this.latestRequestedTrades = rTrade;
      console.log(`Requested Trades:`);
      console.log(this.latestRequestedTrades);
    });
  }

  /**
   * [unsubscribeToRequestedTrades description]
   */
  private unsubscribeToRequestedTrades(): void {
    this.requestedTrades = null;

    this.requestedTradesSub.unsubscribe();
    this.requestedTrades = null;

    this.latestRequestedTrades = null;
  }

  /**
   * [desc]
   */
  private subscribeToAcceptedTrades(uid: String): void {
    this.acceptedTrades = this.afData.list(`/${this.acceptedTradeRef}/${uid}`);

    this.acceptedTradesSub = this.acceptedTrades.subscribe(aTrade => {
      this.latestAcceptedTrades = aTrade;
      console.log(`Accepted Trades:`);
      console.log(this.latestAcceptedTrades);
    });
  }

  /**
   * [unsubscribeToAcceptedTrades description]
   */
  private unsubscribeToAcceptedTrades(): void {
    this.acceptedTrades = null;

    this.acceptedTradesSub.unsubscribe();
    this.acceptedTradesSub = null;

    this.latestAcceptedTrades = null;
  }

  /**
   * [desc]
   */
  private subscribeToDeclinedTrades(uid: String): void {
    this.declinedTrades = this.afData.list(`/${this.declinedTradeRef}/${uid}`);

    this.declinedTradesSub = this.declinedTrades.subscribe(dTrade => {
      this.latestDeclinedTrades = dTrade;
      console.log(`Declined Trades:`);
      console.log(this.latestDeclinedTrades);
    });
  }

  /**
   * [unsubscribeToDeclinedTrades description]
   */
  private unsubscribeToDeclinedTrades(): void {
    this.declinedTrades = null;

    this.declinedTradesSub.unsubscribe();
    this.declinedTradesSub = null;

    this.latestDeclinedTrades = null;
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
   * @param  {ShiftDate}  date  ShiftDate object containing the information required to list the shift for trade
   * @param  {string}     uid   the uid of the person listing the shift for trade
   * @return {void}
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

  /**
   * [removeListedShift description]
   * @param {ShiftDate} date [description]
   * @param {string}    uid  [description]
   */
  public removeListedShift(date: ShiftDate, uid: string): void {
    try {
      //check if the record already exists
      this.afData
          .object(`/${this.listedShiftRef}/${date.toString()}/${uid}`)
          .take(1)
          .subscribe(s => {
            if (!s.$exists()) {

              //if it doesn't exist
              throw new Error('Shift not listed for this user');

            } else {

              //remove the shift from listed shifts
              this.afData
                  .object(`/${this.listedShiftRef}/${date.toString()}/${uid}`)
                  .set(null)
                  .catch(e => { throw e });

              //remove the shift from user's shifts
              this.afData
                  .object(`/${this.userRef}/${uid}/shifts/${date.toString()}`)
                  .set(null)
                  .catch(e => { throw e });

              //remove any requested trades that are not yet accepted, create record
              let declinedRecord = {};
              let r = this.afData.list(`/${this.requestedTradeRef}/${uid}/${date.toString()}`); //set the location of the list

              //take the first list emitted by the observable
              // -> subscribe to it with forEach
              // -> subscription closes automatitcally b/c of take operator
              //
              // IDEA This could probably be refactored into a private function to be more DRY
              r.take(1).forEach(x => {
                //iterate through the returned array
                for (let entry of x) {
                  //create the record to be stored
                  declinedRecord = { "trade-date" : date.toString(),
                                     "uid" : uid,
                                     "reason":"Shift not listed for trade any longer",
                                     "original-comment":entry.comment
                                   };

                  //push the record with unique key to destination list
                  this.afData
                      .list(`/${this.declinedTradeRef}/${entry.$key}/`)
                      .push(declinedRecord);
                }
              });

              r.remove();
            }
          });
    } catch (e) {
      console.log(`Error removing listed shift - ${e}`);
    }
  }

  /**
   * [addRequestedTrade description]
   * @param {ShiftDate} date    [description]
   * @param {string}    uid     [description]
   * @param {string}    comment [description]
   */
  public addRequestedTrade(date: ShiftDate, uidRequestor: string, uidRequestee:string, comment: string = ''): void {
    try {
      //check if the record already exists
      this.afData
          .object(`/${this.listedShiftRef}/${date.toString()}/${uidRequestee}`)
          .take(1)
          .subscribe(s => {
            if (!s.$exists()) {

              //if it doesn't exist
              throw new Error(`Can't ask to trade a shift that doesn't exist.`);

            } else {

              this.afData
                  .object(`/${this.requestedTradeRef}/${uidRequestee}/${date.toString()}/${uidRequestor}/comment`)
                  .set(comment);

            }
          });
    } catch (e) {
        console.log(`Error creating trade request - ${e}`);
    }
  }

  /**
   * [addUser description]
   * @param {[type]} userId [description]
   * @param {[type]} name   [description]
   * @param {[type]} email  [description]
   * @param {[type]} phone  [description]
   */
  public addUser(userId, name, email, phone): void {
    try {
      this.afData
          .object(`/${this.userRef}/${userId}`).update({
            "full-name": name,
            "email": email,
            "phone": phone
          })
          .catch(e => { throw e; });
    } catch (e) {
      console.log(`Error adding user - ${e}`);
    }
  }

}
