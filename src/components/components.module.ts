import {NgModule} from '@angular/core';
import {AttendeeComponent} from './attendee/attendee';
import {DriverComponent} from './driver/driver';
@NgModule({
  declarations: [
    AttendeeComponent,
    DriverComponent
  ],
  imports: [],
  exports: [
    AttendeeComponent,
    DriverComponent
  ]
})
export class ComponentsModule {
}
