import {Component} from '@angular/core';
import {NativeStorage} from '@ionic-native/native-storage';
import {ModalController, NavController, ToastController} from 'ionic-angular';
import {Driver, DriverService, RideType} from '../../services/driver.service';
import {RiderService} from '../../services/rider.service';
import {AutocompletePage} from '../autocomplete/autocomplete';

declare let google: any;

@Component({
  selector: 'page-rides',
  templateUrl: 'rides.html',
  providers: [DriverService, RiderService]
})
export class RidesPage {

  RideType: typeof RideType = RideType;
  driversToGoToRuth: Driver[] = [];
  driversToGoHome: Driver[] = [];
  canDrive: boolean[] = [false, false];
  needARide: boolean[] = [false, false];
  address: string;

  constructor(public navCtrl: NavController,
              public toastCtrl: ToastController,
              public modalCtrl: ModalController,
              private nativeStorage: NativeStorage,
              private riderService: RiderService,
              private driverService: DriverService) {
  }

  showModal() {
    let modal = this.modalCtrl.create(AutocompletePage);
    modal.onDidDismiss(data => {
      if (data) {
        this.address = data.description;
        this.nativeStorage.setItem('address', this.address);
      }
    });
    modal.present();
  }

  ionViewDidEnter() {
    this.nativeStorage.getItem('address')
      .then(address => this.address = address)
      .catch(() => {
      });
    this.driverService.getDrivers(RideType.GoToRuth)
      .then(drivers => this.driversToGoToRuth = drivers)
      .catch(() => {
      });
    this.driverService.getDrivers(RideType.GoHome)
      .then(drivers => this.driversToGoHome = drivers)
      .catch(() => {
      });
  }

  addDriver(rideType: RideType, number_of_seat: number): void {
    if (rideType == RideType.GoHome && !this.address) {
      this.showModal();
      return;
    }
    let driver = new Driver;
    driver.number_of_seat_left = number_of_seat;
    driver.ride_type = rideType;
    this.driverService.createDriver(driver)
      .then(() => {
        this.canDrive[rideType] = true;
        this.driverService.getDrivers(RideType.GoToRuth)
          .then(drivers => this.driversToGoToRuth = drivers)
          .catch(() => {
          });
      })
      .catch(() => this.presentToastServerError());
  }

  addRider(rideType: RideType): void {
    if (rideType == RideType.GoHome && !this.address) {
      this.showModal();
      return;
    }
    this.riderService.createRideRequest()
      .then(() => this.needARide[rideType] = true)
      .catch(() => this.presentToastServerError())
  }

  presentToastServerError() {
    let toast = this.toastCtrl.create({
      message: 'Problem with internet connection. Please make sure that your device is not switched to airplane mode.',
      duration: 5000,
    });
    toast.present();
  }
}
