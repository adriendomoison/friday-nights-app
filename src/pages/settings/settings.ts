import {Component, NgZone} from '@angular/core';
import {NavController, NavParams} from 'ionic-angular';
import {AccountService, User, UserChangePassword} from '../../services/account.service';
import {LoginPage} from '../login/login';

@Component({
  selector: 'page-settings',
  templateUrl: 'settings.html'
})
export class SettingsPage {

  section: number;
  user: User;
  userChangePassword: UserChangePassword;
  password_re: string;
  width: number;

  constructor(public navCtrl: NavController, public navParams: NavParams,
              private accountService: AccountService, ngZone: NgZone) {
    this.section = 1;
    this.user = new User;
    this.userChangePassword = new UserChangePassword;
    this.width = window.innerWidth;

    window.onresize = (e) => {
      ngZone.run(() => {
        this.width = window.innerWidth;
      });
    };
  }

  ngOnInit() {
    this.accountService.retrieveAccessToken()
      .then(() => {
        this.accountService.getCurrentUser()
          .then(user => {
            this.user = user;
            this.userChangePassword.email = this.user.email
          })
      })
      .catch(() => {
      })
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad SettingsPage');
  }

  updateBasicInfo(): void {
    this.accountService.updateUserAccount(this.user)
      .then()
  }

  updatePassword(): void {
    this.accountService.updateUserPassword(this.userChangePassword)
      .then()
  }

  deleteUser(): void {
    this.user.username = this.user.first_name;
    this.accountService.deleteUserAccount()
      .then(() => {
        this.accountService.disconnect()
          .then(() => {
            this.navCtrl.setRoot(LoginPage);
          })
      })
  }
}
