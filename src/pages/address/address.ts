import {Component, OnInit} from '@angular/core';
import {ViewController} from 'ionic-angular';

@Component({
  selector: 'page-address',
  templateUrl: 'address.html',
})
export class AddressPage implements OnInit {

  addressItems: any;
  address: any;
  acService: any;

  constructor(public viewCtrl: ViewController) {
  }

  ngOnInit() {
    this.acService = new google.maps.places.AutocompleteService();
    this.addressItems = [];
    this.address = {
      query: ''
    };
  }

  dismiss() {
    this.viewCtrl.dismiss();
  }

  chooseItem(item: any) {
    this.viewCtrl.dismiss(item);
  }

  updateSearch() {
    if (this.address.query == '') {
      this.addressItems = [];
      return;
    }
    let self = this;
    let config = {
      types: ['geocode'],
      input: this.address.query,
      componentRestrictions: {country: 'US'}
    };
    this.acService.getPlacePredictions(config, function (predictions, status) {
      self.addressItems = [];
      predictions.forEach(function (prediction) {
        self.addressItems.push(prediction);
      });
    });
  }
}
