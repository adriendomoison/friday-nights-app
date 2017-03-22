import {NgModule, ErrorHandler} from '@angular/core';
import {IonicApp, IonicModule, IonicErrorHandler} from 'ionic-angular';
import {MyApp} from './app.component';
import {AboutPage} from '../pages/about/about';
import {ContactPage} from '../pages/contact/contact';
import {HomePage} from '../pages/home/home';
import {TabsPage} from '../pages/tabs/tabs';
import {LoginPage} from "../pages/login/login";
import {LoadingPage} from "../pages/loading/loading";
import {SettingsPage} from "../pages/settings/settings";
import {SignUpPage} from "../pages/sign-up/sign-up";
import {AccountService} from "../services/account.service";
import {CheckoutPage} from "../pages/checkout/checkout";
import {ProfilePage} from "../pages/profile/profile";
import {CreditCardExpirationDirective} from "../directives/credit-card-expiration.directive";
import {CreditCardNumberDirective} from "../directives/credit-card-number.directive";
import {ListCardsComponent} from "../components/list-cards/list-cards.component";
import {AddCardComponent} from "../components/add-card/add-card.component";

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
        TabsPage,
        AddCardComponent,
        ListCardsComponent,
        CreditCardNumberDirective,
        CreditCardExpirationDirective,
    ],
    imports: [
        IonicModule.forRoot(MyApp),
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
        CheckoutPage,
        TabsPage
    ],
    providers: [
        AccountService,
        {provide: ErrorHandler, useClass: IonicErrorHandler}
    ]
})
export class AppModule {
}
