import {Injectable} from '@angular/core';
import {Headers, Http} from '@angular/http';
import {environment} from '../environments/environment';

import 'rxjs/add/operator/toPromise';

export enum RideType {
  GoToRuth = 0,
  GoHome
}

export class Driver {
  public_id: string;
  first_name: string;
  last_name: string;
  profile_picture_url: string;
  number_of_seat_left: number;
  ride_type: RideType
}

@Injectable()
export class DriverService {

  private serviceURL = environment.API_URL + '/api/v1/drivers';
  private headers = new Headers({'Content-Type': 'application/json'});

  constructor(private http: Http) {
  }

  getDrivers(ride: RideType): Promise<Driver[]> {

    let params: URLSearchParams = new URLSearchParams();
    params.set('ride', ride.toString());

    return this.http.get(this.serviceURL, {search: params, headers: this.headers})
      .toPromise()
      .then(response => response.json() as Driver[])
      .catch(this.handleError);
  }

  getDriver(public_id: string): Promise<Driver> {
    const url = `${this.serviceURL}/${public_id}`;
    return this.http.get(url, {headers: this.headers})
      .toPromise()
      .then(response => response.json() as Driver)
      .catch(this.handleError);
  }


  updateDriver(driver: Driver): Promise<Driver> {
    const url = `${this.serviceURL}/${driver.public_id}`;
    return this.http
      .put(url, JSON.stringify(driver), {headers: this.headers})
      .toPromise()
      .then(response => response.json() as Driver)
      .catch(this.handleError);
  }

  createDriver(driver: Driver): Promise<Driver> {
    return this.http
      .post(this.serviceURL, JSON.stringify(driver), {headers: this.headers})
      .toPromise()
      .then(res => res.json())
      .catch(this.handleError);
  }

  deleteDriver(): Promise<void> {
    const url = `${this.serviceURL}/me`;
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
