import {Component, Input} from '@angular/core';
import {Driver, DriverService} from '../../services/driver.service';
import {AlertController} from 'ionic-angular';
import {User} from '../../services/account.service';

@Component({
  selector: 'driver',
  templateUrl: 'driver.html',
  providers: [DriverService]
})
export class DriverComponent {

  @Input() driver: Driver;

  user: User = new User;

  constructor(public alertCtrl: AlertController, private driverService: DriverService) {
  }

}
