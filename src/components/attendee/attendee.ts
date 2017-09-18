import {Component, Input} from '@angular/core';
import {Attendee, AttendeeService} from '../../services/attendee.service';

@Component({
  selector: 'attendee',
  templateUrl: 'attendee.html',
  providers: [AttendeeService]
})
export class AttendeeComponent {

  @Input() attendee: Attendee;

  constructor() {
  }
}
