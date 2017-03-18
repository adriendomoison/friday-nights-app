import {Component, ViewChild} from '@angular/core';
import {Platform, Nav} from 'ionic-angular';
import {StatusBar, Splashscreen} from 'ionic-native';
import {LoadingPage} from "../pages/loading/loading";
import {AccountService} from "../services/account.service";
import {SettingsPage} from "../pages/settings/settings";
import {LoginPage} from "../pages/login/login";


@Component({
    templateUrl: 'app.html'
})
export class MyApp {

    rootPage: any = LoadingPage;

    @ViewChild(Nav) nav;

    constructor(platform: Platform, private accountService: AccountService) {
        platform.ready().then(() => {
            // Okay, so the platform is ready and our plugins are available.
            // Here you can do any higher level native things you might need.
            StatusBar.styleDefault();
            Splashscreen.hide();
        });
    }

    openSettings(): void {
        this.nav.push(SettingsPage);
    }

    logout(): void {
        this.accountService.disconnect()
            .then(() => {
                this.nav.setRoot(LoginPage);
            })
    }
}
