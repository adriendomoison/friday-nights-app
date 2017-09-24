import {Injectable} from '@angular/core';
import {Headers, Http} from '@angular/http';
import {environment} from '../environments/environment';

import 'rxjs/add/operator/toPromise';
import {Address} from './address.service';

export class Info {
  public_id: string;
  next_event_date: string;
  next_event_start_time: string;
  next_event_address: Address;
  message: string;
}

@Injectable()
export class InfoService {

  private serviceURL = environment.API_URL + '/api/v1/event-infos';
  private headers = new Headers({'Content-Type': 'application/json'});

  constructor(private http: Http) {
  }

  getInfo(): Promise<Info> {
    return this.http.get(`${this.serviceURL}/next-event`)
      .toPromise()
      .then(response => response.json() as Info)
      .catch(this.handleError);
  }

  updateInfo(info: Info): Promise<Info> {
    const url = `${this.serviceURL}/${info.public_id}`;
    return this.http
      .put(url, JSON.stringify(info), {headers: this.headers})
      .toPromise()
      .then(response => response.json() as Info)
      .catch(this.handleError);
  }

  deleteInfo(public_id: string): Promise<void> {
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
