import {Component, ViewChild} from '@angular/core';
import {Nav, Platform} from 'ionic-angular';
import {AccountService} from '../services/account.service';
import {LoginPage} from '../pages/login/login';
import {SplashScreen} from '@ionic-native/splash-screen';
import {StatusBar} from '@ionic-native/status-bar';
import {TabsControllerPage} from '../pages/tabs-controller/tabs-controller';
import {NativeStorage} from '@ionic-native/native-storage';
import {Attendee, AttendeeService} from '../services/attendee.service';
import {SettingsPage} from '../pages/settings/settings';

@Component({
  templateUrl: 'app.html'
})
export class MyApp {

  rootPage: any;
  user: Attendee = new Attendee;

  @ViewChild(Nav) nav;

  constructor(private accountService: AccountService,
              private attendeeService: AttendeeService,
              private nativeStorage: NativeStorage,
              private platform: Platform,
              private statusBar: StatusBar,
              private splashScreen: SplashScreen) {
    platform.ready().then(() => {
      statusBar.styleDefault();
      this.attendeeService.profileObs$.subscribe(profile => this.user = profile);
      this.nativeStorage.getItem('user')
        .then(data => {
          this.accountService.connectFromRefreshToken(data.refresh_token).then(() => {
            this.splashScreen.hide();
            this.nav.push(TabsControllerPage);
          }).catch(() => {
            this.splashScreen.hide();
            this.nav.setRoot(LoginPage)
          });
        })
        .catch(() => {
          this.splashScreen.hide();
          this.nav.setRoot(LoginPage)
        });
    });
  }

  openSettings(): void {
    this.nav.push(SettingsPage);
  }

  logout(): void {
    this.accountService.disconnect()
      .then(() => {
        this.nav.setRoot(LoginPage);
      })
  }
}
