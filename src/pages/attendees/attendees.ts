import {Component, OnInit} from '@angular/core';
import {NavController, ToastController} from 'ionic-angular';
import {Attendee, AttendeeService} from '../../services/attendee.service';

@Component({
  selector: 'page-attendees',
  templateUrl: 'attendees.html',
  providers: [AttendeeService]
})
export class AttendeesPage implements OnInit {

  attendees: Attendee[] = [];
  user: Attendee = new Attendee;
  next_friday_night_date: string;

  constructor(public navCtrl: NavController,
              public toastCtrl: ToastController,
              private attendeeService: AttendeeService) {
    this.next_friday_night_date = '...';
  }

  ngOnInit(): void {
    this.attendeeService.getAttendee()
      .then(user => {
        this.user = user
      })
      .catch(() => {
      });
    this.attendeeService.getAttendees()
      .then(attendees => this.attendees = attendees)
      .catch(() => {
      });
  }

  updateAttendance(): void {
    this.user.next_friday_attendance_status
      ? this.attendeeService.deleteAttendance().catch(() => {
      this.presentToastServerError();
      this.user.next_friday_attendance_status = true;
    })
      : this.attendeeService.setAttendance().catch(() => {
      this.presentToastServerError();
      this.user.next_friday_attendance_status = false;
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
