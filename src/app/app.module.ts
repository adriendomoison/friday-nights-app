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
import {NativeStorage} from '@ionic-native/native-storage';
import {Facebook} from '@ionic-native/facebook';
import {SMS} from '@ionic-native/sms';
import {CallNumber} from '@ionic-native/call-number';
import {Push} from '@ionic-native/push';
import {AgmCoreModule} from '@agm/core';
import {AddressPage} from '../pages/address/address';
import {SuperTabsController, SuperTabsModule} from 'ionic2-super-tabs';
import {AttendeeService} from '../services/attendee.service';
import {SeatsPage} from '../pages/seats/seats';
import {Utils} from '../services/utils.service';

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
    AddressPage,
    SeatsPage,
  ],
  imports: [
    HttpModule,
    BrowserModule,
    SuperTabsModule,
    AgmCoreModule.forRoot({
      apiKey: 'AIzaSyCaFEVccoGDqwT7b34jS-QtAQzbD2RikHc',
      libraries: ['places']
    }),
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
    AddressPage,
    SeatsPage,
  ],
  providers: [
    SuperTabsController,
    AccountService,
    AttendeeService,
    StatusBar,
    SplashScreen,
    NativeStorage,
    Facebook,
    SMS,
    CallNumber,
    Push,
    Utils,
    {provide: ErrorHandler, useClass: IonicErrorHandler}
  ]
})
export class AppModule {
}
