import {Component, OnInit} from '@angular/core';
import {NavController, ToastController} from 'ionic-angular';
import {Attendee, AttendeeService} from '../../services/attendee.service';
import {LoginPage} from '../login/login';
import {AccountService} from '../../services/account.service';

@Component({
  selector: 'page-attendees',
  templateUrl: 'attendees.html',
  providers: [AttendeeService]
})
export class AttendeesPage implements OnInit {

  attendees: Attendee[] = [];
  user: Attendee = new Attendee;
  next_event_date: string;

  constructor(public navCtrl: NavController,
              public accountService: AccountService,
              public toastCtrl: ToastController,
              private attendeeService: AttendeeService) {
    this.next_event_date = '...';
  }

  ngOnInit(): void {
    this.accountService.retrieveAccessToken()
      .then(() => {
        if (!this.accountService.isConnected)
          this.navCtrl.setRoot(LoginPage);
        else {
          this.attendeeService.getAttendee()
            .then(user => {
              this.user = user;
            })
            .catch(() => {
            });
          this.attendeeService.getAttendees()
            .then(attendees => this.attendees = attendees)
            .catch(() => {
            });
        }
      });
  }

  updateAttendance(): void {
    this.user.next_event_attendance_status
      ? this.attendeeService.deleteAttendance().catch(() => {
      this.presentToastServerError();
      this.user.next_event_attendance_status = true;
    })
      : this.attendeeService.setAttendance().catch(() => {
      this.presentToastServerError();
      this.user.next_event_attendance_status = false;
    })
  }

  presentToastServerError() {
    let toast = this.toastCtrl.create({
      message: 'Problem with internet connection. Please make sure that your device is not switched to airplane mode.',
      duration: 5000
    });
    toast.present();
  }
}
