import {Component} from '@angular/core';
import {NavController, ToastController} from 'ionic-angular';
import {Attendee, AttendeeService} from '../../services/attendee.service';
import {LoginPage} from '../login/login';
import {AccountService} from '../../services/account.service';

@Component({
  selector: 'page-attendees',
  templateUrl: 'attendees.html',
  providers: [AttendeeService]
})
export class AttendeesPage {

  attendees: Attendee[] = [];
  user: Attendee = new Attendee;
  next_event_date: string;

  constructor(public navCtrl: NavController,
              public accountService: AccountService,
              public toastCtrl: ToastController,
              private attendeeService: AttendeeService) {
    this.next_event_date = '...';
  }

  ionViewDidEnter() {
    this.accountService.retrieveAccessToken()
      .then(() => {
        if (!this.accountService.isConnected)
          this.navCtrl.setRoot(LoginPage);
        else {
          this.fetchProfile();
          this.fetchAttendeeList();
        }
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
      .then(attendees => this.attendees = attendees)
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
      position: 'top'
    });
    toast.present();
  }

  presentToastRegistrationSuccess() {
    let toast = this.toastCtrl.create({
      message: 'You are registered. See you Friday!',
      duration: 3000,
      position: 'top'
    });
    toast.present();
  }

  presentToastDeregistrationSuccess() {
    let toast = this.toastCtrl.create({
      message: 'You have been successfully deregistered.',
      duration: 3000,
      position: 'top'
    });
    toast.present();
  }
}
