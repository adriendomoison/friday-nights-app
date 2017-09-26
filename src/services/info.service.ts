import {Injectable} from '@angular/core';
import {Headers, Http} from '@angular/http';
import {environment} from '../environments/environment';

import 'rxjs/add/operator/toPromise';

export class EventInfo {
  public_id: string;
  date: string;
  starting_time: string;
  ending_time: string;
  location: string;
  message: string;
  is_past: boolean;
}

@Injectable()
export class InfoService {

  private serviceURL = environment.API_URL + '/api/v1/event-infos';
  private headers = new Headers({'Content-Type': 'application/json'});

  constructor(private http: Http) {
  }

  getInfo(): Promise<EventInfo> {
    return this.http.get(`${this.serviceURL}/next-event`)
      .toPromise()
      .then(response => response.json() as EventInfo)
      .catch(this.handleError);
  }

  updateInfo(info: EventInfo): Promise<EventInfo> {
    const url = `${this.serviceURL}/${info.public_id}`;
    return this.http
      .put(url, JSON.stringify(info), {headers: this.headers})
      .toPromise()
      .then(response => response.json() as EventInfo)
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
