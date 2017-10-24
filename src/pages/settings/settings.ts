import {Component} from '@angular/core';
import {NavController, ToastController} from 'ionic-angular';
import {AccountService, User, UserChangePassword} from '../../services/account.service';
import {LoginPage} from '../login/login';

@Component({
  selector: 'page-settings',
  templateUrl: 'settings.html'
})
export class SettingsPage {

  user: User;
  userChangePassword: UserChangePassword;
  password_re: string;

  constructor(public navCtrl: NavController,
              private toastCtrl: ToastController,
              private accountService: AccountService) {
    this.user = new User;
    this.userChangePassword = new UserChangePassword;
  }

  ngOnInit() {
    this.accountService.getCurrentUser()
      .then(user => {
        this.user = user;
        this.userChangePassword.email = this.user.email
      })
  }

  updateBasicInfo(): void {
    this.accountService.updateUserAccount(this.user)
      .then(() => this.presentToastChangeSaved())
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

  presentToastChangeSaved() {
    let toast = this.toastCtrl.create({
      message: 'Your changes have been saved!',
      duration: 2000,
    });
    toast.present();
  }
}
