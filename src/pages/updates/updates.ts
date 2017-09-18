import {Component} from '@angular/core';
import {NavController, ToastController} from 'ionic-angular';
import {CallNumber} from '@ionic-native/call-number';
import {SMS} from '@ionic-native/sms';
import {AttendeeService} from '../../services/attendee.service';

@Component({
  selector: 'page-updates',
  templateUrl: 'updates.html',
  providers: [CallNumber, SMS, AttendeeService]
})
export class UpdatesPage {

  private text: string;
  private wantToText: boolean = false;
  private message: string;

  constructor(public navCtrl: NavController,
              public toastCtrl: ToastController,
              private attendeeService: AttendeeService,
              private callNumber: CallNumber,
              private sms: SMS) {
  }

  callRuth(): void {
    this.callNumber.callNumber('760-583-2381', true)
      .then(() => console.log('Launched dialer!'))
      .catch(() => console.log('Error launching dialer'));
  }

  sendMessageToRuth(): void {
    this.sms.send('760-583-2381', this.text)
      .then(() => {
        this.wantToText = false;
        let toast = this.toastCtrl.create({
          message: 'Text message sent!',
          duration: 3000
        });
        toast.present();
      })
      .catch(() => {
        let toast = this.toastCtrl.create({
          message: 'Your text was not delivered, please try with your message app: (760)-583-2381.',
          duration: 3000
        });
        toast.present();
      });
  }

  goToRides(): void {
    this.navCtrl.parent.select(0);
  }

  setAttendanceToYes(): void {
    this.attendeeService.setAttendance()
      .catch(() => this.presentToastServerError())
  }

  setAttendanceToNo(): void {
    this.attendeeService.deleteAttendance()
      .catch(() => this.presentToastServerError())
  }

  presentToastServerError() {
    let toast = this.toastCtrl.create({
      message: 'Problem with internet connection. Please make sure that your device is not switched to airplane mode.',
      duration: 5000
    });
    toast.present();
  }
}
