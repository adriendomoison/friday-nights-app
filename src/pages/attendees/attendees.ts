import {Component} from '@angular/core';
import {NavController, ToastController} from 'ionic-angular';
import {Attendee, AttendeeService} from '../../services/attendee.service';
import {LoginPage} from '../login/login';
import {AccountService} from '../../services/account.service';
import {Event, EventService} from '../../services/event.service';

@Component({
  selector: 'page-attendees',
  templateUrl: 'attendees.html',
  providers: [EventService]
})
export class AttendeesPage {

  attendees: Attendee[] = [];
  user: Attendee = new Attendee;
  info: Event = new Event;
  attendees_is_loaded: boolean = false;

  constructor(public navCtrl: NavController,
              public accountService: AccountService,
              public infoService: EventService,
              public toastCtrl: ToastController,
              private attendeeService: AttendeeService) {
  }

  ionViewDidEnter() {
    if (!this.accountService.isConnected)
      this.navCtrl.setRoot(LoginPage);
    else {
      this.fetchEventInfo();
      this.fetchProfile();
      this.fetchAttendeeList();
    }
  }

  fetchEventInfo(): void {
    this.infoService.getEvent()
      .then(info => this.info = info)
      .catch(() => this.info.is_past = true);
  }

  fetchProfile(): void {
    this.user = this.attendeeService.profileLatest;
    this.attendeeService.profileObs$.subscribe(profile => this.user = profile);
  }

  fetchAttendeeList(): void {
    this.attendeeService.getAttendees()
      .then(attendees => {
        this.attendees = attendees;
        this.attendees_is_loaded = true;
      })
      .catch(() => {
      });
  }

  updateAttendance(): void {
    this.user.attendance_status
      ? this.attendeeService.deleteAttendance()
      .then(() => {
        this.presentToastDeregistrationSuccess();
        this.fetchAttendeeList()
      })
      .catch(() => this.attendanceStatusUpdateError())
      : this.attendeeService.setAttendance()
      .then(() => {
        this.presentToastRegistrationSuccess();
        this.fetchAttendeeList()
      })
      .catch(() => this.attendanceStatusUpdateError())
  }

  attendanceStatusUpdateError() {
    this.user.attendance_status = !this.user.attendance_status;
    let toast = this.toastCtrl.create({
      message: 'Oh no! Something bad happened. Please come back later when we fixed that problem. Thanks.',
      duration: 4000,
    });
    toast.present();
  }

  presentToastRegistrationSuccess() {
    let toast = this.toastCtrl.create({
      message: 'You are registered. See you Friday!',
      duration: 3000,
    });
    toast.present();
  }

  presentToastDeregistrationSuccess() {
    let toast = this.toastCtrl.create({
      message: 'You have been successfully deregistered.',
      duration: 3000,
    });
    toast.present();
  }
}
