import {Injectable} from '@angular/core';
import {Headers, Http} from '@angular/http';
import {environment} from '../environments/environment';
import {Address} from './address.service';
import {Driver} from './driver.service';

import 'rxjs/add/operator/toPromise';

export class Rider {
  public_id: string;
  first_name: string;
  last_name: string;
  profile_picture_url: string;
  address: Address;
  driver: Driver;
}

@Injectable()
export class RiderService {

  private serviceURL = environment.API_URL + '/api/v1/riders';
  private headers = new Headers({'Content-Type': 'application/json'});

  constructor(private http: Http) {
  }

  getRiders(): Promise<Rider[]> {
    return this.http.get(this.serviceURL)
      .toPromise()
      .then(response => response.json() as Rider[])
      .catch(this.handleError);
  }

  getRider(public_id: string): Promise<Rider> {
    const url = `${this.serviceURL}/${public_id}`;
    return this.http.get(url, {headers: this.headers})
      .toPromise()
      .then(response => response.json() as Rider)
      .catch(this.handleError);
  }

  updateRider(rider: Rider): Promise<Rider> {
    const url = `${this.serviceURL}/${rider.public_id}`;
    return this.http
      .put(url, JSON.stringify(rider), {headers: this.headers})
      .toPromise()
      .then(response => response.json() as Rider)
      .catch(this.handleError);
  }

  createRideRequest(): Promise<Rider> {
    return this.http
      .post(this.serviceURL, {}, {headers: this.headers})
      .toPromise()
      .then(res => res.json())
      .catch(this.handleError);
  }

  addRider(rider: Rider): Promise<Rider> {
    return this.http
      .post(this.serviceURL, JSON.stringify(rider), {headers: this.headers})
      .toPromise()
      .then(res => res.json())
      .catch(this.handleError);
  }

  deleteRider(public_id: string): Promise<void> {
    const url = `${this.serviceURL}/${public_id}`;
    return this.http.delete(url, {headers: this.headers})
      .toPromise()
      .then(() => null)
      .catch(this.handleError);
  }

  private handleError(error: any): Promise<any> {
    console.error('An error occurred', error);
    return Promise.reject(error.message || error);
  }
}
