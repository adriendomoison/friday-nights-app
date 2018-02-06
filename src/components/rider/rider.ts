import {Component, Input} from '@angular/core';
import {Rider} from '../../services/rider.service';
import {User} from '../../services/account.service';

@Component({
  selector: 'rider',
  templateUrl: 'rider.html'
})
export class RiderComponent {

  @Input() rider: Rider;

  user: User = new User;

  constructor() {
  }

}
