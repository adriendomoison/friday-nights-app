import {Component} from '@angular/core';
import {NavController, NavParams} from 'ionic-angular';
import {User, AccountService} from "../../services/account.service";
import {HomePage} from "../home/home";
import {LoginPage} from "../login/login";

/*
 Generated class for the SignUp page.

 See http://ionicframework.com/docs/v2/components/#navigation for more info on
 Ionic pages and navigation.
 */
@Component({
    selector: 'page-sign-up',
    templateUrl: 'sign-up.html'
})
export class SignUpPage {

    user: User;
    password_re: string;
    wrong_field: boolean;

    constructor(public navCtrl: NavController, public navParams: NavParams, private accountService: AccountService) {
        this.user = new User;
        this.wrong_field = false;
    }

    ngOnInit() {
    }

    signUp(): void {
        if (this.password_re != this.user.password) {
            this.wrong_field = true;
        } else {
            this.user.username = this.user.first_name;
            this.accountService.signUp(this.user)
                .then(() => {
                    this.navCtrl.setRoot(HomePage);
                })
        }
    }

    openLoginPage(): void {
        this.navCtrl.setRoot(LoginPage);
    }

    ionViewDidLoad() {
        console.log('ionViewDidLoad SignUpPage');
    }

}
