import {BrowserModule} from '@angular/platform-browser';
import {ErrorHandler, NgModule} from '@angular/core';
import {HttpModule} from '@angular/http';
import {IonicApp, IonicErrorHandler, IonicModule} from 'ionic-angular';
import {SplashScreen} from '@ionic-native/splash-screen';
import {StatusBar} from '@ionic-native/status-bar';

import {MyApp} from './app.component';
import {AboutPage} from '../pages/about/about';
import {ContactPage} from '../pages/contact/contact';
import {LoginPage} from '../pages/login/login';
import {SettingsPage} from '../pages/settings/settings';
import {ProfilePage} from '../pages/profile/profile';
import {AccountService} from '../services/account.service';
import {TabsControllerPage} from '../pages/tabs-controller/tabs-controller';
import {DriverComponent} from '../components/driver/driver';
import {AttendeeComponent} from '../components/attendee/attendee';
import {RidesPage} from '../pages/rides/rides';
import {AttendeesPage} from '../pages/attendees/attendees';
import {UpdatesPage} from '../pages/updates/updates';

@NgModule({
  declarations: [
    MyApp,
    TabsControllerPage,
    AboutPage,
    ContactPage,
    LoginPage,
    SettingsPage,
    ProfilePage,
    UpdatesPage,
    RidesPage,
    AttendeesPage,
    DriverComponent,
    AttendeeComponent,
  ],
  imports: [
    HttpModule,
    BrowserModule,
    IonicModule.forRoot(MyApp)
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    TabsControllerPage,
    AboutPage,
    ContactPage,
    LoginPage,
    SettingsPage,
    ProfilePage,
    UpdatesPage,
    RidesPage,
    AttendeesPage,
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
