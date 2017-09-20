import {Component} from '@angular/core';
import {NavController, ToastController} from 'ionic-angular';
import {CallNumber} from '@ionic-native/call-number';
import {SMS} from '@ionic-native/sms';
import {AttendeeService} from '../../services/attendee.service';
import {LoginPage} from '../login/login';
import {AccountService} from '../../services/account.service';

@Component({
  selector: 'page-updates',
  templateUrl: 'updates.html',
  providers: [CallNumber, SMS, AttendeeService]
})
export class UpdatesPage {

  private text: string;
  private wantToText: boolean = false;
  private message: string;
  private isRegistered;

  constructor(public navCtrl: NavController,
              public toastCtrl: ToastController,
              private accountService: AccountService,
              private attendeeService: AttendeeService,
              private callNumber: CallNumber,
              private sms: SMS) {
  }

  ionViewDidEnter() {
    this.accountService.retrieveAccessToken()
      .then(() => {
        if (!this.accountService.isConnected)
          this.navCtrl.setRoot(LoginPage);
        else {
          this.fetchProfile();
        }
      });  }

  fetchProfile(): void {
    this.attendeeService.getAttendee()
      .then(user => {
         this.isRegistered = user.next_event_attendance_status;
      })
      .catch(() => {
      });
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
          duration: 3000,
          position: 'top'
        });
        toast.present();
      })
      .catch(() => {
        let toast = this.toastCtrl.create({
          message: 'Your text was not delivered, please try with your message app: (760)-583-2381.',
          duration: 3000,
          position: 'top'
        });
        toast.present();
      });
  }

  goToRides(): void {
    this.navCtrl.parent.select(0);
  }

  setAttendanceToYes(): void {
    this.attendeeService.setAttendance()
      .then(() => {
      this.isRegistered = true;
      this.presentToastRegistrationSuccess();
      })
      .catch(() => this.presentToastServerError())
  }

  presentToastRegistrationSuccess() {
    let toast = this.toastCtrl.create({
      message: 'Thank you for letting us know! See you Friday!',
      duration: 3000,
      position: 'top'
    });
    toast.present();
  }

  presentToastServerError() {
    let toast = this.toastCtrl.create({
      message: 'Problem with internet connection. Please make sure that your device is not switched to airplane mode.',
      duration: 5000,
      position: 'top'
    });
    toast.present();
  }
}
