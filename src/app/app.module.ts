import {BrowserModule} from '@angular/platform-browser';
import {ErrorHandler, NgModule} from '@angular/core';
import {HttpModule} from '@angular/http';
import {IonicApp, IonicErrorHandler, IonicModule} from 'ionic-angular';
import {SplashScreen} from '@ionic-native/splash-screen';
import {StatusBar} from '@ionic-native/status-bar';

import {MyApp} from './app.component';
import {HomePage} from '../pages/home/home';
import {AboutPage} from '../pages/about/about';
import {ContactPage} from '../pages/contact/contact';
import {LoginPage} from '../pages/login/login';
import {LoadingPage} from '../pages/loading/loading';
import {SettingsPage} from '../pages/settings/settings';
import {SignUpPage} from '../pages/sign-up/sign-up';
import {ProfilePage} from '../pages/profile/profile';
import {CheckoutPage} from '../pages/checkout/checkout';
import {CreditCardNumberDirective} from '../directives/credit-card-number.directive';
import {CreditCardExpirationDirective} from '../directives/credit-card-expiration.directive';
import {AddCardComponent} from '../components/add-card/add-card.component';
import {ListCardsComponent} from '../components/list-cards/list-cards.component';
import {AccountService} from '../services/account.service';

@NgModule({
  declarations: [
    MyApp,
    AboutPage,
    ContactPage,
    HomePage,
    LoginPage,
    LoadingPage,
    SettingsPage,
    SignUpPage,
    ProfilePage,
    CheckoutPage,
    AddCardComponent,
    ListCardsComponent,
    CreditCardNumberDirective,
    CreditCardExpirationDirective,
  ],
  imports: [
    HttpModule,
    BrowserModule,
    IonicModule.forRoot(MyApp)
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    AboutPage,
    ContactPage,
    HomePage,
    LoginPage,
    LoadingPage,
    SettingsPage,
    SignUpPage,
    ProfilePage,
    CheckoutPage
  ],
  providers: [
    AccountService,
    StatusBar,
    SplashScreen,
    {provide: ErrorHandler, useClass: IonicErrorHandler}
  ]
})
export class AppModule {
}
