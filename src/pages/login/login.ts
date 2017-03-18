import {Component} from '@angular/core';
import {NavController, NavParams} from 'ionic-angular';
import {AccountService, FacebookCredentials, Credentials} from "../../services/account.service";
import {FacebookService, FacebookInitParams} from "ng2-facebook-sdk";
import {environment} from "../../environments/environment";
import {HomePage} from "../home/home";
import {SignUpPage} from "../sign-up/sign-up";

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
                public navParams: NavParams,
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

    openSignUpPage(): void {
        this.navCtrl.setRoot(SignUpPage);
    }

    signIn(): void {
        this.accountService.signIn(this.credentials)
            .then(() => {
                this.navCtrl.setRoot(HomePage);
            }, () => {
            })
    }

    facebookLogin(): void {
        this.fb.login({
            scope: 'public_profile,email,user_birthday,user_about_me'
        }).then(
            (response) => {
                this.accountService.facebookSignIn(new FacebookCredentials(response.authResponse.userID, response.authResponse.accessToken))
                    .then(() => {
                        this.navCtrl.setRoot(HomePage);
                    }, () => {
                    })
            }, (error: any) => console.error(error)
        );
    }
}
