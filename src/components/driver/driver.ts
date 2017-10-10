import {Component, Input} from '@angular/core';
import {Driver} from '../../services/driver.service';
import {User} from '../../services/account.service';

@Component({
  selector: 'driver',
  templateUrl: 'driver.html'
})
export class DriverComponent {

  @Input() driver: Driver;

  user: User = new User;

  constructor() {
  }

}
