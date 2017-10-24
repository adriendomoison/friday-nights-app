import {Component} from '@angular/core';
import {NativeStorage} from '@ionic-native/native-storage';
import {ModalController, NavController, ToastController} from 'ionic-angular';
import {Driver, DriverService} from '../../services/driver.service';
import {Rider, RiderService} from '../../services/rider.service';
import {AddressPage} from '../address/address';
import {SeatsPage} from '../seats/seats';
import {RideType, UserType, Utils} from '../../services/utils.service';
import {AccountService} from '../../services/account.service';
import {Event, EventService} from '../../services/event.service';

@Component({
  selector: 'page-rides',
  templateUrl: 'rides.html',
  providers: [DriverService, RiderService, EventService]
})
export class RidesPage {

  RideType: typeof RideType = RideType;
  UserType: typeof UserType = UserType;
  drivers: Driver[][] = [];
  canDrive: boolean[] = [false, false];
  needARide: boolean[] = [false, false];
  address: string;
  seats: number;
  event: Event = new Event;

  constructor(public navCtrl: NavController,
              public toastCtrl: ToastController,
              public modalCtrl: ModalController,
              public accountService: AccountService,
              private nativeStorage: NativeStorage,
              private eventService: EventService,
              private riderService: RiderService,
              private driverService: DriverService,
              private utils: Utils) {
    this.drivers[RideType.GO_HOME] = [];
    this.drivers[RideType.GO_TO_RUTH] = [];
  }

  ionViewDidEnter() {
    this.nativeStorage.getItem('address')
      .then(address => this.address = address)
      .catch(() => {
      });
    this.fetchEvent();
    this.fetchDriverList();
    this.fetchMyStatus();
  }

  private fetchEvent(): void {
    this.eventService.getEvent()
      .then(info => this.event = info)
      .catch(() => this.event.is_past = true);
  }

  private fetchDriverList() {
    this.driverService.getDrivers(RideType.GO_TO_RUTH)
      .then(drivers => this.drivers[RideType.GO_TO_RUTH] = drivers)
      .catch(() => {
      });
    this.driverService.getDrivers(RideType.GO_HOME)
      .then(drivers => this.drivers[RideType.GO_HOME] = drivers)
      .catch(() => {
      });
  }

  private fetchMyStatus() {
    this.accountService.getUserRideStatus()
      .then(status => {
        this.canDrive[RideType.GO_TO_RUTH] = status.is_driver_to_ruth;
        this.canDrive[RideType.GO_HOME] = status.is_driver_home;
        this.needARide[RideType.GO_TO_RUTH] = status.is_rider_to_ruth;
        this.needARide[RideType.GO_HOME] = status.is_rider_home;
      })
  }


  showModalAddAddress(origin: UserType) {
    let modal = this.modalCtrl.create(AddressPage);
    modal.onDidDismiss(data => {
      if (data) {
        this.address = data.description;
        this.nativeStorage.setItem('address', this.address);
        origin == UserType.RIDER ? this.addRider(RideType.GO_HOME) : this.addDriver(RideType.GO_HOME);
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
        this.seats = 0;
      }
    });
    modal.present();
  }

  addDriver(rideType: RideType): void {
    if (rideType == RideType.GO_HOME && !this.address)
      return this.showModalAddAddress(UserType.DRIVER);
    if (!this.seats)
      return this.showModalSeats(rideType);
    let driver = new Driver;
    driver.number_of_seats = this.seats;
    driver.ride_type = this.utils.rideTypeToString(rideType);
    driver.address = this.address;
    this.driverService.createDriver(driver)
      .then(() => {
        this.presentToastDriverAdded();
        this.canDrive[rideType] = true;
        this.driverService.getDrivers(rideType)
          .then(drivers => this.drivers[rideType] = drivers)
          .catch(() => {
          });
      })
      .catch(() => this.presentToastServerError());
  }

  addRider(rideType: RideType): void {
    if (rideType == RideType.GO_HOME && !this.address)
      return this.showModalAddAddress(UserType.RIDER);
    let rider = new Rider;
    rider.address = this.address;
    rider.ride_type = this.utils.rideTypeToString(rideType);
    this.riderService.addRider(rider)
      .then(() => {
        this.presentToastRiderAdded();
        this.needARide[rideType] = true;
      })
      .catch(() => this.presentToastServerError())
  }

  cancelRideOffer(rideType: RideType) {
    this.driverService.deleteDriver(rideType)
      .then(() => {
        this.canDrive[rideType] = false;
        this.presentToastDriverDeleted();
        this.driverService.getDrivers(rideType)
          .then(drivers => this.drivers[rideType] = drivers)
          .catch(() => {
          });
      })
  }

  cancelRideRequest(rideType: RideType) {
    this.riderService.deleteRider(rideType)
      .then(() => {
        this.needARide[rideType] = false;
        this.presentToastRiderDeleted();
      })
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
      message: 'Thank you for driving students, you are awesome!',
      duration: 3000,
    });
    toast.present();
  }

  presentToastDriverDeleted() {
    let toast = this.toastCtrl.create({
      message: 'You have been removed from the driver list.',
      duration: 3000,
    });
    toast.present();
  }

  presentToastRiderDeleted() {
    let toast = this.toastCtrl.create({
      message: 'Your ride has been successfully canceled.',
      duration: 3000,
    });
    toast.present();
  }

  presentToastRiderAdded() {
    let toast = this.toastCtrl.create({
      message: 'Request saved. We\'ll find you a safe drive!',
      duration: 3000,
    });
    toast.present();
  }
}
