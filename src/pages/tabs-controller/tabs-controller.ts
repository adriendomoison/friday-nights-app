import {Component} from '@angular/core';
import {NavController} from 'ionic-angular';
import {UpdatesPage} from '../updates/updates';
import {AttendeesPage} from '../attendees/attendees';
import {RidesPage} from '../rides/rides';

@Component({
  selector: 'page-tabs-controller',
  templateUrl: 'tabs-controller.html'
})
export class TabsControllerPage {

  tab1Root: any = RidesPage;
  tab2Root: any = UpdatesPage;
  tab3Root: any = AttendeesPage;

  constructor(public navCtrl: NavController) {
  }

  goToUpdates(params) {
    if (!params) params = {};
    this.navCtrl.push(UpdatesPage);
  }

  goToAttendees(params) {
    if (!params) params = {};
    this.navCtrl.push(AttendeesPage);
  }
}
