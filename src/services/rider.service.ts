import {Injectable} from '@angular/core';
import {Headers, Http} from '@angular/http';
import {environment} from '../environments/environment';
import {RideType, Utils} from './utils.service';
import {AccountService} from './account.service';
import 'rxjs/add/operator/toPromise';
import {HttpParams} from '@angular/common/http';

export class Rider {
  public_id: string;
  ride_type: string;
  first_name: string;
  last_name: string;
  profile_picture_url: string;
  address: string;
  driver_public_id: string;
}

@Injectable()
export class RiderService {

  private serviceURL = environment.API_URL + '/api/v1/rider';
  private headers = new Headers({'Content-Type': 'application/json'});

  constructor(private http: Http, private utils: Utils, private accountService: AccountService) {
  }

  getRiders(rideType: RideType): Promise<Rider[]> {
    const url = `${this.serviceURL}s`;
    let params = new HttpParams().set('ridetype', this.utils.rideTypeToString(rideType));
    return this.http.get(url, {params: params.toString(), headers: this.headers})
      .toPromise()
      .then(response => response.json() as Rider[])
      .catch(this.handleError);
  }

  getRider(): Promise<Rider> {
    const url = `${this.serviceURL}`;
    return this.http.get(url, {headers: this.headers})
      .toPromise()
      .then(response => response.json() as Rider)
      .catch(this.handleError);
  }

  updateRider(rider: Rider): Promise<Rider> {
    const url = `${this.serviceURL}`;
    return this.http
      .put(url, JSON.stringify(rider), {headers: this.headers})
      .toPromise()
      .then(response => response.json() as Rider)
      .catch(this.handleError);
  }

  addRider(rider: Rider): Promise<Rider> {
    const url = `${this.serviceURL}s`;
    this.headers.set('Authorization', 'Bearer ' + this.accountService.getAuth().access_token);
    return this.http
      .post(url, JSON.stringify(rider), {headers: this.headers})
      .toPromise()
      .then(res => res.json())
      .catch(this.handleError);
  }

  deleteRider(rideType: RideType): Promise<void> {
    const url = `${this.serviceURL}`;
    let params = new HttpParams().set('ridetype', this.utils.rideTypeToString(rideType));
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
