import {Component, OnInit} from '@angular/core';
import {ViewController} from 'ionic-angular';

@Component({
  selector: 'page-autocomplete',
  templateUrl: 'autocomplete.html',
})
export class AutocompletePage implements OnInit {

  autocompleteItems: any;
  autocomplete: any;
  acService: any;

  constructor(public viewCtrl: ViewController) {
  }

  ngOnInit() {
    this.acService = new google.maps.places.AutocompleteService();
    this.autocompleteItems = [];
    this.autocomplete = {
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
    if (this.autocomplete.query == '') {
      this.autocompleteItems = [];
      return;
    }
    let self = this;
    let config = {
      types: ['geocode'],
      input: this.autocomplete.query,
      componentRestrictions: {country: 'US'}
    };
    this.acService.getPlacePredictions(config, function (predictions, status) {
      self.autocompleteItems = [];
      predictions.forEach(function (prediction) {
        self.autocompleteItems.push(prediction);
      });
    });
  }
}
