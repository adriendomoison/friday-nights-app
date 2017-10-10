import {Component, Input, SimpleChanges} from '@angular/core';
import {Attendee} from '../../services/attendee.service';

@Component({
  selector: 'attendee',
  templateUrl: 'attendee.html'
})
export class AttendeeComponent {

  @Input() attendee: Attendee = new Attendee;
  attendance_count_suffix: string = 'th';

  constructor() {
  }

  ngOnChanges(changes: SimpleChanges) {
    if ((this.attendee.attendance_count + 1) % 10 == 1) {
      this.attendance_count_suffix = 'st'
    } else if ((this.attendee.attendance_count + 1) % 10 == 2) {
      this.attendance_count_suffix = 'nd'
    } else if ((this.attendee.attendance_count + 1) % 10 == 3) {
      this.attendance_count_suffix = 'rd'
    }
  }
}
