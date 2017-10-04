import {Component} from '@angular/core';
import {NavController, ToastController} from 'ionic-angular';
import {Attendee, AttendeeService} from '../../services/attendee.service';
import {LoginPage} from '../login/login';
import {AccountService} from '../../services/account.service';
import {EventInfo, InfoService} from '../../services/info.service';

@Component({
  selector: 'page-attendees',
  templateUrl: 'attendees.html',
  providers: [AttendeeService, InfoService]
})
export class AttendeesPage {

  attendees: Attendee[] = [];
  user: Attendee = new Attendee;
  info: EventInfo = new EventInfo;
  attendees_is_loaded: boolean = false;

  constructor(public navCtrl: NavController,
              public accountService: AccountService,
              public infoService: InfoService,
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
    this.infoService.getInfo()
      .then(info => this.info = info)
      .catch(() => {
      });
  }

  fetchProfile(): void {
    this.attendeeService.getAttendee()
      .then(user => {
        this.user = user;
      })
      .catch(() => {
      });
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
    this.user.next_event_attendance_status
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
    this.user.next_event_attendance_status = !this.user.next_event_attendance_status;
    let toast = this.toastCtrl.create({
      message: 'Problem with internet connection. Please make sure that your device is not switched to airplane mode.',
      duration: 5000,
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
