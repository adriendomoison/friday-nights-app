import {Component} from '@angular/core';
import {NavController} from 'ionic-angular';
import {AccountService, Credentials, FacebookCredentials} from '../../services/account.service';
import {FacebookInitParams, FacebookService} from 'ng2-facebook-sdk';
import {environment} from '../../environments/environment';
import {HomePage} from '../home/home';
import {SignUpPage} from '../sign-up/sign-up';
import {TabsControllerPage} from '../tabs-controller/tabs-controller';

/*
 Generated class for the Login page.

 See http://ionicframework.com/docs/v2/components/#navigation for more info on
 Ionic pages and navigation.
 */
@Component({
  selector: 'page-login',
  templateUrl: 'login.html',
  providers: [FacebookService]
})
export class LoginPage {

  credentials: Credentials;
  wrong_credentials: boolean;

  constructor(public navCtrl: NavController,
              private accountService: AccountService,
              private fb: FacebookService) {
    this.wrong_credentials = false;
    this.credentials = new Credentials;
  }

  ngOnInit() {
    let fbParams: FacebookInitParams = {
      appId: environment.FACEBOOK_CLIENT_ID,
      xfbml: true,
      version: 'v2.8'
    };
    this.fb.init(fbParams);
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad LoginPage');
  }

  signIn(): void {
    this.accountService.signIn(this.credentials)
      .then(() => {
        this.navCtrl.setRoot(TabsControllerPage);
      }, () => {
      })
  }

  facebookLogin(): void {
    this.fb.login({
      scope: 'public_profile,email,user_birthday,user_hometown'
    }).then(
      (response) => {
        this.accountService.facebookSignIn(new FacebookCredentials(response.authResponse.userID, response.authResponse.accessToken))
          .then(() => {
            this.navCtrl.setRoot(TabsControllerPage);
          }, () => {
          })
      }, (error: any) => console.error(error)
    );
  }
}
