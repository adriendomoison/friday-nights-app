import {Component, OnInit} from '@angular/core';
import {NavController, ToastController} from 'ionic-angular';
import {Driver, DriverService, RideType} from '../../services/driver.service';
import {RiderService} from '../../services/rider.service';

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

  constructor(public navCtrl: NavController,
              public toastCtrl: ToastController,
              private riderService: RiderService,
              private driverService: DriverService) {
  }

  ionViewDidEnter() {
    this.driverService.getDrivers(RideType.GoToRuth)
      .then(drivers => this.driversToGoToRuth = drivers)
      .catch(() => {
      });
    this.driverService.getDrivers(RideType.GoHome)
      .then(drivers => this.driversToGoHome = drivers)
      .catch(() => {
      });  }

  addDriver(rideType: RideType, number_of_seat: number): void {
    this.canDrive[rideType] = true;
    let driver = new Driver;
    driver.number_of_seat_left = number_of_seat;
    driver.ride_type = rideType;
    this.driverService.createDriver(driver)
      .then(() => {
        this.driverService.getDrivers(RideType.GoToRuth)
          .then(drivers => this.driversToGoToRuth = drivers)
          .catch(() => {
          });
      })
      .catch(() => {
        this.presentToastServerError();
        this.canDrive[rideType] = false;
      })
  }

  addRider(rideType: RideType): void {
    this.needARide[rideType] = true;
    this.riderService.createRideRequest()
      .catch(() => {
        this.presentToastServerError();
        this.needARide[rideType] = false
      })
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
