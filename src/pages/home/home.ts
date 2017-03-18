import {Component} from '@angular/core';

import {NavController, NavParams} from 'ionic-angular';
import {ProfilePage} from "../profile/profile";
import {CheckoutPage} from "../checkout/checkout";

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
}
