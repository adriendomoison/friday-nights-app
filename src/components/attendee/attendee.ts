import {Component, Input} from '@angular/core';
import {Attendee} from '../../services/attendee.service';

@Component({
  selector: 'attendee',
  templateUrl: 'attendee.html'
})
export class AttendeeComponent {

  @Input() attendee: Attendee;

  constructor() {
  }
}
