import {Injectable} from '@angular/core';
import {Headers, Http} from '@angular/http';
import {environment} from '../environments/environment';

import 'rxjs/add/operator/toPromise';
import {RideType, Utils} from './utils.service';
import {AccountService} from './account.service';
import {HttpParams} from '@angular/common/http';

export class Driver {
  public_id: string;
  first_name: string;
  last_name: string;
  profile_picture_url: string;
  number_of_seats: number;
  ride_type: string;
  status: string;
  address: string;
}

@Injectable()
export class DriverService {

  private serviceURL = environment.API_URL + '/api/v1/driver';
  private headers = new Headers({'Content-Type': 'application/json'});

  constructor(private http: Http, private accountService: AccountService) {
  }

  getDrivers(rideType: RideType): Promise<Driver[]> {
    const url = `${this.serviceURL}s`;
    let params = new HttpParams().set('ridetype', Utils.rideTypeToString(rideType));
    return this.http.get(url, {params: params.toString(), headers: this.headers})
      .toPromise()
      .then(response => response.json() as Driver[])
      .catch(this.handleError);
  }

  getDriver(): Promise<Driver> {
    const url = `${this.serviceURL}`;
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
    const url = `${this.serviceURL}s`;
    this.headers.set('Authorization', 'Bearer ' + this.accountService.getAuth().access_token);
    return this.http
      .post(url, JSON.stringify(driver), {headers: this.headers})
      .toPromise()
      .then(res => res.json())
      .catch(this.handleError);
  }

  deleteDriver(rideType: RideType): Promise<void> {
    const url = `${this.serviceURL}`;
    let params = new HttpParams().set('ridetype', Utils.rideTypeToString(rideType));
    this.headers.set('Authorization', 'Bearer ' + this.accountService.getAuth().access_token);
    return this.http.delete(url, {params: params.toString(), headers: this.headers})
      .toPromise()
      .then(() => null)
      .catch(this.handleError);
  }

  private handleError(error: any): Promise<any> {
    console.error('An error occurred', error);
    return Promise.reject(error.message || error);
  }
}
