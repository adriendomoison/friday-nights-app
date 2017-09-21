import {Component, ViewChild} from '@angular/core';
import {Nav, Platform} from 'ionic-angular';
import {AccountService, UserNotificationToken} from '../services/account.service';
import {SettingsPage} from '../pages/settings/settings';
import {LoginPage} from '../pages/login/login';
import {SplashScreen} from '@ionic-native/splash-screen';
import {StatusBar} from '@ionic-native/status-bar';
import {TabsControllerPage} from '../pages/tabs-controller/tabs-controller';
import {NativeStorage} from '@ionic-native/native-storage';
import {Push, PushObject, PushOptions} from '@ionic-native/push';

@Component({
  templateUrl: 'app.html',
})
export class MyApp {

  rootPage: any = LoginPage;

  @ViewChild(Nav) nav;

  constructor(private accountService: AccountService,
              private nativeStorage: NativeStorage,
              private platform: Platform,
              private push: Push,
              private statusBar: StatusBar,
              private splashScreen: SplashScreen) {
    platform.ready().then(() => {
      statusBar.styleDefault();
      this.nativeStorage.getItem('user')
        .then(data => {
          this.accountService.connectFromRefreshToken(data.refresh_token).then(() => {
            this.initPushNotification();
          }).catch(() => {
            this.splashScreen.hide();
          });
        })
        .catch(() => {
          this.splashScreen.hide();
        });
    });
  }

  initPushNotification() {
    if (!this.platform.is('cordova')) {
      return;
    }
    const options: PushOptions = {
      android: {
        senderID: '916881271895'
      },
      ios: {
        alert: 'true',
        badge: false,
        sound: 'true'
      },
      windows: {}
    };
    const pushObject: PushObject = this.push.init(options);

    pushObject.on('registration').subscribe((data: any) => {
      console.log('device token ->', data.registrationId);
      this.accountService.getCurrentUser().then(user => {
        this.accountService.updateNotificationToken(new UserNotificationToken(user.email, data.registrationId));
      });
    });

    pushObject.on('notification').subscribe((data: any) => {
      //if user not using app and push notification comes
      if (!data.additionalData.foreground) {
        this.nav.push(TabsControllerPage);
      }
    });

    pushObject.on('error').subscribe(error => console.error('Error with Push plugin', error));
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
