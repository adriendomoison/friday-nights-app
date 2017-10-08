import {Component} from '@angular/core';
import {NativeStorage} from '@ionic-native/native-storage';
import {ModalController, NavController, ToastController} from 'ionic-angular';
import {Driver, DriverService, RideType} from '../../services/driver.service';
import {RiderService} from '../../services/rider.service';
import {AddressPage} from '../address/address';
import {SeatsPage} from '../seats/seats';

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
  seats: number;

  constructor(public navCtrl: NavController,
              public toastCtrl: ToastController,
              public modalCtrl: ModalController,
              private nativeStorage: NativeStorage,
              private riderService: RiderService,
              private driverService: DriverService) {
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

  showModalAddAddress(rideType: RideType) {
    let modal = this.modalCtrl.create(AddressPage);
    modal.onDidDismiss(data => {
      if (data) {
        this.address = data.description;
        this.nativeStorage.setItem('address', this.address);
        this.addRider(rideType)
      }
    });
    modal.present();
  }

  showModalSeats(rideType: RideType) {
    let modal = this.modalCtrl.create(SeatsPage);
    modal.onDidDismiss(data => {
      if (data) {
        this.seats = data.seats;
        this.addDriver(rideType);
      }
    });
    modal.present();
  }

  addDriver(rideType: RideType): void {
    if (rideType == RideType.GoHome && !this.address)
      return this.showModalAddAddress(RideType.GoHome);
    if (!this.seats)
      return this.showModalSeats(RideType.GoHome);
    let driver = new Driver;
    driver.number_of_seat_left = this.seats;
    driver.ride_type = rideType;
    this.driverService.createDriver(driver)
      .then(() => {
        this.presentToastDriverAdded();
        this.canDrive[rideType] = true;
        this.driverService.getDrivers(RideType.GoToRuth)
          .then(drivers => this.driversToGoToRuth = drivers)
          .catch(() => {
          });
      })
      .catch(() => this.presentToastServerError());
  }

  addRider(rideType: RideType): void {
    if (rideType == RideType.GoHome && !this.address)
      return this.showModalAddAddress(RideType.GoHome);
    this.riderService.createRideRequest()
      .then(() => {
        this.presentToastRiderAdded();
        this.needARide[rideType] = true;
      })
      .catch(() => this.presentToastServerError())
  }

  presentToastServerError() {
    let toast = this.toastCtrl.create({
      message: 'Oh no! Something bad happened. Please come back later when we fixed that problem. Thanks.',
      duration: 4000,
    });
    toast.present();
  }

  presentToastDriverAdded() {
    let toast = this.toastCtrl.create({
      message: '💌 Thank you so much for driving students, you are amazing.',
      duration: 3000,
    });
    toast.present();
  }

  presentToastRiderAdded() {
    let toast = this.toastCtrl.create({
      message: 'Ride request saved. We\'ll find you a safe drive home!',
      duration: 3000,
    });
    toast.present();
  }
}
