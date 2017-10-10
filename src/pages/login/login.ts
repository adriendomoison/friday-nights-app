import {Component} from '@angular/core';
import {NavController, Platform, ToastController} from 'ionic-angular';
import {AccountService, FacebookCredentials, UserNotificationToken} from '../../services/account.service';
import {Facebook} from '@ionic-native/facebook';
import {Push, PushObject, PushOptions} from '@ionic-native/push';
import {TabsControllerPage} from '../tabs-controller/tabs-controller';

@Component({
  selector: 'page-login',
  templateUrl: 'login.html',
})
export class LoginPage {

  loginProcess: boolean = false;

  constructor(public navCtrl: NavController,
              public toastCtrl: ToastController,
              private platform: Platform,
              private push: Push,
              private facebook: Facebook,
              private accountService: AccountService) {
  }

  initPushNotification() {
    if (!this.platform.is('cordova')) {
      return;
    }

    this.push.hasPermission()
      .then((res: any) => {
        if (res.isEnabled) {
          console.log('We have permission to send push notifications');
        } else {
          console.log('We do not have permission to send push notifications');
        }
      });

    const options: PushOptions = {
      android: {
        // senderID: '797816708457', // TODO move it to the JSON file as v2.0 spec requires
      },
      ios: {
        alert: 'true',
        badge: true,
        sound: 'false'
      },
      windows: {},
      browser: {
        pushServiceURL: 'http://push.api.phonegap.com/v1/push'
      }
    };

    const pushObject: PushObject = this.push.init(options);

    pushObject.on('registration').subscribe((data: any) => {
      console.log('device token ->', data.registrationId);
      this.accountService.getCurrentUser().then(user => {
        this.accountService.updateNotificationToken(new UserNotificationToken(user.email, data.registrationId));
      });
    });

    pushObject.on('error').subscribe(error => console.error('Error with Push plugin', error));
  }

  facebookLogin(): void {
    this.loginProcess = true;
    this.facebook.login(['public_profile', 'email', 'user_birthday', 'user_hometown'])
      .then(response => this.loginViaFacebook(response))
      .catch(error => {
        console.log(error);
        this.loginProcess = false;
      });
  }

  loginViaFacebook(response): void {
    this.accountService.facebookSignIn(new FacebookCredentials(response.authResponse.userID, response.authResponse.accessToken))
      .then(() => {
        this.initPushNotification();
        this.navCtrl.setRoot(TabsControllerPage)
      })
      .catch(() => {
        this.presentToastServerError();
        this.loginProcess = false
      })
  }

  presentToastServerError() {
    let toast = this.toastCtrl.create({
      message: 'Oh no! Something bad happened. Please come back later when we fixed that problem. Thanks.',
      duration: 4000,
    });
    toast.present();
  }
}
