//Angular Imports
import { NgModule }       from '@angular/core';
import { BrowserModule }  from '@angular/platform-browser';
import { FormsModule }    from '@angular/forms';

import { NgbModule }      from '@ng-bootstrap/ng-bootstrap';

import { AngularFireModule } from 'angularfire2';
import { AngularFireDatabaseModule } from 'angularfire2/database';
import { AngularFireAuthModule } from 'angularfire2/auth';

//Project Modules
import { RoutingModule }   from './modules/routing/routing.module'

//Module's Bootstrapped Component
import { AppComponent }   from './app.component'

//Project Components
import { AComponent }     from './components/a/a.component'; //test component, blank, TODO get rid of later

//Project Pipes
import { BPipe }          from './pipes/b.pipe'; //test pipe, blank, TODO get rid of later

//Project Services
import { ShiftTradeDataService } from './services/shift-trade-data.service'

export const firebaseConfig = {
  apiKey: "AIzaSyA2HqP8JfQOnhX158gRBRhx6kqja4GGDFk",
  authDomain: "shift-trader.firebaseapp.com",
  databaseURL: "https://shift-trader.firebaseio.com",
  storageBucket: "shift-trader.appspot.com",
  messagingSenderId: "1447578558"
};

@NgModule({
  declarations: [
    AppComponent,
    AComponent, //test component, blank, TODO get rid of later
    BPipe //test pipe, blank, TODO get rid of later
  ],
  imports: [
    BrowserModule,
    NgbModule.forRoot(),
    AngularFireModule.initializeApp(firebaseConfig),
    AngularFireDatabaseModule,
    AngularFireAuthModule,
    RoutingModule
  ],
  providers: [ShiftTradeDataService],
  bootstrap: [AppComponent]
})
export class AppModule { }
