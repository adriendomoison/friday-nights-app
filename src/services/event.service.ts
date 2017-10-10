import {Injectable} from '@angular/core';
import {Http} from '@angular/http';
import {environment} from '../environments/environment';

import 'rxjs/add/operator/toPromise';

export class Event {
  public_id: string;
  date: string;
  starting_time: string;
  ending_time: string;
  location: string;
  message: string;
  is_past: boolean;
}

@Injectable()
export class EventService {

  private serviceURL = environment.API_URL + '/api/v1/event';

  constructor(private http: Http) {
  }

  getEvent(): Promise<Event> {
    return this.http.get(`${this.serviceURL}/next`)
      .toPromise()
      .then(response => response.json() as Event)
      .catch(this.handleError);
  }

  private handleError(error: any): Promise<any> {
    console.error('An error occurred', error);
    return Promise.reject(error.message || error);
  }
}
