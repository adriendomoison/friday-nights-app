import {Component} from '@angular/core';
import {NavController, NavParams} from 'ionic-angular';
import {LoginPage} from "../login/login";

/*
 Generated class for the Loading page.

 See http://ionicframework.com/docs/v2/components/#navigation for more info on
 Ionic pages and navigation.
 */
@Component({
    selector: 'page-loading',
    templateUrl: 'loading.html'
})
export class LoadingPage {

    constructor(public navCtrl: NavController, public navParams: NavParams) {
    }

    ionViewDidLoad() {
        console.log('ionViewDidLoad LoadingPage');
        this.navCtrl.setRoot(LoginPage);
    }

}
