import {Component, NgZone} from '@angular/core';
import {NavController, ToastController} from 'ionic-angular';
import {CallNumber} from '@ionic-native/call-number';
import {SMS} from '@ionic-native/sms';
import {AttendeeService} from '../../services/attendee.service';
import {LoginPage} from '../login/login';
import {AccountService} from '../../services/account.service';
import {Event, EventService} from '../../services/event.service';

@Component({
  selector: 'page-updates',
  templateUrl: 'updates.html',
  providers: [EventService]
})
export class UpdatesPage {

  private text: string;
  private wantToText: boolean = false;
  private info: Event = new Event;
  private isRegistered = true;
  lat: number = 33.1291222;
  lng: number = -117.1619581;
  geoService: any;
  map_style: any = [
    {
      'stylers': [
        {
          'color': '#607d8b'
        }
      ]
    },
    {
      'elementType': 'geometry',
      'stylers': [
        {
          'color': '#242f3e'
        }
      ]
    },
    {
      'elementType': 'labels.text.fill',
      'stylers': [
        {
          'color': '#746855'
        }
      ]
    },
    {
      'elementType': 'labels.text.stroke',
      'stylers': [
        {
          'color': '#242f3e'
        }
      ]
    },
    {
      'featureType': 'administrative',
      'stylers': [
        {
          'visibility': 'simplified'
        }
      ]
    },
    {
      'featureType': 'administrative.locality',
      'elementType': 'labels.text.fill',
      'stylers': [
        {
          'color': '#d59563'
        }
      ]
    },
    {
      'featureType': 'landscape',
      'elementType': 'geometry',
      'stylers': [
        {
          'color': '#607d8b'
        }
      ]
    },
    {
      'featureType': 'landscape',
      'elementType': 'labels',
      'stylers': [
        {
          'visibility': 'off'
        }
      ]
    },
    {
      'featureType': 'landscape.natural',
      'stylers': [
        {
          'color': '#455a64'
        }
      ]
    },
    {
      'featureType': 'poi',
      'stylers': [
        {
          'visibility': 'off'
        }
      ]
    },
    {
      'featureType': 'poi',
      'elementType': 'labels',
      'stylers': [
        {
          'visibility': 'off'
        }
      ]
    },
    {
      'featureType': 'poi',
      'elementType': 'labels.text.fill',
      'stylers': [
        {
          'color': '#d59563'
        }
      ]
    },
    {
      'featureType': 'poi.park',
      'elementType': 'geometry',
      'stylers': [
        {
          'color': '#263c3f'
        }
      ]
    },
    {
      'featureType': 'poi.park',
      'elementType': 'geometry.fill',
      'stylers': [
        {
          'visibility': 'on'
        }
      ]
    },
    {
      'featureType': 'poi.park',
      'elementType': 'labels.text.fill',
      'stylers': [
        {
          'color': '#6b9a76'
        }
      ]
    },
    {
      'featureType': 'road',
      'stylers': [
        {
          'visibility': 'simplified'
        }
      ]
    },
    {
      'featureType': 'road',
      'elementType': 'geometry',
      'stylers': [
        {
          'color': '#38414e'
        }
      ]
    },
    {
      'featureType': 'road',
      'elementType': 'geometry.stroke',
      'stylers': [
        {
          'color': '#212a37'
        }
      ]
    },
    {
      'featureType': 'road',
      'elementType': 'labels',
      'stylers': [
        {
          'visibility': 'on'
        }
      ]
    },
    {
      'featureType': 'road',
      'elementType': 'labels.text.fill',
      'stylers': [
        {
          'color': '#9ca5b3'
        }
      ]
    },
    {
      'featureType': 'road.highway',
      'elementType': 'geometry',
      'stylers': [
        {
          'color': '#746855'
        }
      ]
    },
    {
      'featureType': 'road.highway',
      'elementType': 'geometry.stroke',
      'stylers': [
        {
          'color': '#1f2835'
        }
      ]
    },
    {
      'featureType': 'road.highway',
      'elementType': 'labels.text.fill',
      'stylers': [
        {
          'color': '#f3d19c'
        }
      ]
    },
    {
      'featureType': 'transit',
      'elementType': 'geometry',
      'stylers': [
        {
          'color': '#2f3948'
        }
      ]
    },
    {
      'featureType': 'transit',
      'elementType': 'labels',
      'stylers': [
        {
          'visibility': 'off'
        }
      ]
    },
    {
      'featureType': 'transit.station',
      'elementType': 'labels.text.fill',
      'stylers': [
        {
          'color': '#d59563'
        }
      ]
    },
    {
      'featureType': 'water',
      'elementType': 'geometry',
      'stylers': [
        {
          'color': '#17263c'
        }
      ]
    },
    {
      'featureType': 'water',
      'elementType': 'labels.text.fill',
      'stylers': [
        {
          'color': '#515c6d'
        }
      ]
    },
    {
      'featureType': 'water',
      'elementType': 'labels.text.stroke',
      'stylers': [
        {
          'color': '#17263c'
        }
      ]
    }
  ];

  constructor(public navCtrl: NavController,
              public toastCtrl: ToastController,
              public eventService: EventService,
              private ngZone: NgZone,
              private accountService: AccountService,
              private attendeeService: AttendeeService,
              private callNumber: CallNumber,
              private sms: SMS) {
  }

  ngOnInit(): void {
    this.geoService = new google.maps.Geocoder();
  }

  ionViewDidEnter() {
    if (!this.accountService.isConnected)
      this.navCtrl.setRoot(LoginPage);
    else {
      this.fetchEvent();
      this.fetchProfile();
    }
  }

  private fetchEvent(): void {
    this.eventService.getEvent()
      .then(info => {
        this.info = info;
        this.fetchEventLocation()
      })
      .catch(() => this.info.is_past = true);
  }

  private fetchEventLocation() {
    this.geoService.geocode({
      address: this.info.location
    }, (results, status) => {
      this.ngZone.run(() => {
        this.lat = results[0].geometry.location.toJSON().lat;
        this.lng = results[0].geometry.location.toJSON().lng;
      });
    });
  }

  private fetchProfile(): void {
    this.isRegistered = this.attendeeService.profileLatest.attendance_status;
    this.attendeeService.profileObs$.subscribe(profile => this.isRegistered = profile.attendance_status);
  }

  callRuth(): void {
    this.callNumber.callNumber('760-583-2381', true)
      .then(() => console.log('Launched dialer!'))
      .catch(() => console.log('Error launching dialer'));
  }

  sendMessageToRuth(): void {
    this.sms.send('760-583-2381', this.text)
      .then(() => {
        this.wantToText = false;
        let toast = this.toastCtrl.create({
          message: 'Text message sent!',
          duration: 3000,
        });
        toast.present();
      })
      .catch(() => {
        let toast = this.toastCtrl.create({
          message: 'Your text was not delivered, please try with your message app: (760)-583-2381.',
          duration: 3000,
        });
        toast.present();
      });
  }

  setAttendanceToYes(): void {
    this.attendeeService.setAttendance()
      .then(() => {
        this.isRegistered = true;
        this.presentToastRegistrationSuccess();
      })
      .catch(() => this.presentToastServerError())
  }

  presentToastRegistrationSuccess() {
    let toast = this.toastCtrl.create({
      message: 'Thank you for letting us know! See you Friday!',
      duration: 3000,
    });
    toast.present();
  }

  presentToastServerError() {
    let toast = this.toastCtrl.create({
      message: 'Oh no! Something bad happened. Please come back later when we fixed that problem. Thanks.',
      duration: 4000,
    });
    toast.present();
  }
}
