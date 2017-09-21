import {Component} from '@angular/core';
import {NavController, Platform} from 'ionic-angular';
import {AccountService, Credentials, FacebookCredentials} from '../../services/account.service';
import {FacebookInitParams, FacebookService} from 'ng2-facebook-sdk';
import {environment} from '../../environments/environment';
import {HomePage} from '../home/home';
import {SignUpPage} from '../sign-up/sign-up';
import {TabsControllerPage} from '../tabs-controller/tabs-controller';
import {Facebook} from '@ionic-native/facebook';

@Component({
  selector: 'page-login',
  templateUrl: 'login.html',
})
export class LoginPage {

  credentials: Credentials = new Credentials;
  loginProcess: boolean = false;

  constructor(public plt: Platform,
              public navCtrl: NavController,
              private facebook: Facebook,
              private accountService: AccountService,
              private fb: FacebookService) {
  }

  ngOnInit() {

  }

  signIn(): void {
    this.accountService.signIn(this.credentials)
      .then(() => {
        this.navCtrl.setRoot(TabsControllerPage);
      }, () => {
      })
  }

  facebookLogin(): void {
    let fbParams: FacebookInitParams = {
      appId: environment.FACEBOOK_CLIENT_ID,
      xfbml: true,
      version: 'v2.8'
    };
    this.fb.init(fbParams);
    this.loginProcess = true;
    this.plt.is('mobileweb') || this.plt.is('core') ? this.facebookWebLogin() : this.facebookMobileLogin()
  }

  facebookMobileLogin(): void {
    this.facebook.login(['public_profile', 'email', 'user_birthday', 'user_hometown'])
      .then(response => this.login(response))
      .catch(error => {
        console.log(error);
        this.loginProcess = false;
      });
  }

  facebookWebLogin(): void {
    this.fb.login({scope: 'public_profile,email,user_birthday,user_hometown'})
      .then(response => this.login(response))
      .catch(error => {
        console.error(error);
        this.loginProcess = false;
      });
  }

  login(response): void {
    this.accountService.facebookSignIn(new FacebookCredentials(response.authResponse.userID, response.authResponse.accessToken))
      .then(() => this.navCtrl.setRoot(TabsControllerPage))
      .catch(() => this.loginProcess = false)
  }
}
