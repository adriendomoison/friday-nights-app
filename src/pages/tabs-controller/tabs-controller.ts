import {Component} from '@angular/core';
import {NavController} from 'ionic-angular';
import {UpdatesPage} from '../updates/updates';
import {AttendeesPage} from '../attendees/attendees';
import {RidesPage} from '../rides/rides';
import {AccountService} from '../../services/account.service';
import {LoginPage} from '../login/login';
import {AttendeeService} from '../../services/attendee.service';

@Component({
  selector: 'page-tabs-controller',
  templateUrl: 'tabs-controller.html'
})
export class TabsControllerPage {

  tab1Root: any = RidesPage;
  tab2Root: any = UpdatesPage;
  tab3Root: any = AttendeesPage;

  constructor(public navCtrl: NavController,
              private attendeeService: AttendeeService,
              private accountService: AccountService) {
  }

  ngOnInit() {
    if (!this.accountService.isConnected)
      this.navCtrl.setRoot(LoginPage);
    this.attendeeService.loadUserProfile();
  }
}
