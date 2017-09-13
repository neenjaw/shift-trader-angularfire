//Angular Imports
import { BrowserModule }  from '@angular/platform-browser';
import { NgModule }       from '@angular/core';
import { FormsModule } from '@angular/forms';

import { NgbModule }      from '@ng-bootstrap/ng-bootstrap';

import { AngularFireModule } from 'angularfire2';
import { AngularFireDatabaseModule } from 'angularfire2/database';
import { AngularFireAuthModule } from 'angularfire2/auth';

//Module's Bootstrapped Component
import { AppComponent }   from './app.component'

//Project Modules
import { RoutingModule }   from './modules/routing/routing.module'

//Project Components
import { AComponent }     from './components/a/a.component';

//Project Pipes
import { BPipe }          from './pipes/b.pipe';

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
    AComponent,
    BPipe
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
