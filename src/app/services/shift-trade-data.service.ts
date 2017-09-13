import { Injectable }     from '@angular/core';
import { Headers, Http }  from '@angular/http';

//Rxjs
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/toPromise';

//AngularFire2 Import Structure
import { AngularFireDatabase, FirebaseListObservable } from 'angularfire2/database';
import { AngularFireAuth } from 'angularfire2/auth';
import * as firebase from 'firebase/app';

@Injectable()
export class ShiftTradeDataService {

  private userRef: string = '/users';
  private tendingTradeRef: string = '/requested-trades';
  private acceptedTradeRef: string = '/accepted-trades';
  private appRef: string = 'app';

  //declarations for firebase usage
  public authUser: Observable<firebase.User>; //allows us to access the user state
  public items: FirebaseListObservable<any[]>; //stores the firebase list
  public msgVal: string = ''; //stores the user submitted entry

  //pass in the AngularFireAuth and AngularFireDatabase by dependency injection
  constructor(public afAuth: AngularFireAuth, public af: AngularFireDatabase) {

    this.items = af.list('/messages', {
      query: {
        limitToLast: 50
      }
    });

    this.authUser = this.afAuth.authState;
  }

  public anonymousLogin(): void {
    this.afAuth.auth.signInAnonymously();
  }

  public logout(): void {
    this.afAuth.auth.signOut();
  }

  public sendMessage(desc: string): void {
    this.items.push({ message: desc });
    this.msgVal = '';
  }

  public writeUserData(userId, name, email, phone): void {
    firebase.database().ref(this.userRef + userId).set({
      name: name,
      email: email,
      phone: phone
    });
  }

}
