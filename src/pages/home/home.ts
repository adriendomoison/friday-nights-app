import {Component} from '@angular/core';

import {NavController, NavParams} from 'ionic-angular';
import {ProfilePage} from '../profile/profile';
import {CheckoutPage} from '../checkout/checkout';
import {SignUpPage} from '../sign-up/sign-up';
import {LoginPage} from '../login/login';

@Component({
  selector: 'page-home',
  templateUrl: 'home.html',
})
export class HomePage {

  constructor(public navCtrl: NavController, public navParams: NavParams) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad HomePage');
  }

  pushProfile(): void {
    this.navCtrl.push(ProfilePage)
  }

  pushCheckout(): void {
    this.navCtrl.push(CheckoutPage)
  }

  pushLogin(): void {
    this.navCtrl.push(LoginPage)
  }

  pushSignUp(): void {
    this.navCtrl.push(SignUpPage)
  }
}
