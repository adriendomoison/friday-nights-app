import {Component} from '@angular/core';
import {ViewController} from 'ionic-angular';

export class Seat {
  seats: number
}

@Component({
  selector: 'page-seats',
  templateUrl: 'seats.html',
})
export class SeatsPage {

  seats: number;

  constructor(public viewCtrl: ViewController) {
  }

  dismiss() {
    this.viewCtrl.dismiss();
  }

  setSeats(seats) {
    let s = new Seat();
    s.seats = seats;
    this.viewCtrl.dismiss(s);
  }
}
