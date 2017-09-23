import {Injectable} from '@angular/core';
import {Headers, Http} from '@angular/http';
import {environment} from '../environments/environment';
import {AccountService} from './account.service';

import 'rxjs/add/operator/toPromise';

export class Attendee {
  public_id: string;
  first_name: string;
  last_name: string;
  home_country: string;
  profile_picture_url: string;
  next_event_attendance_status: boolean;
}

@Injectable()
export class AttendeeService {

  private serviceURL = environment.API_URL + '/api/v1/attendees';
  private headers = new Headers({'Content-Type': 'application/json'});

  constructor(private http: Http, private accountService: AccountService) {
  }

  getAttendees(): Promise<Attendee[]> {
    return this.http.get(this.serviceURL)
      .toPromise()
      .then(response => response.json() as Attendee[])
      .catch(this.handleError);
  }

  getAttendee(): Promise<Attendee> {
    const url = `${this.serviceURL}/me`;
    this.headers.set('Authorization', 'Bearer ' + this.accountService.getAuth().access_token);
    return this.http.get(url, {headers: this.headers})
      .toPromise()
      .then(response => response.json() as Attendee)
      .catch(this.handleError);
  }

  setAttendance(): Promise<void> {
    const url = `${this.serviceURL}/me`;
    this.headers.set('Authorization', 'Bearer ' + this.accountService.getAuth().access_token);
    return this.http
      .post(url, {}, {headers: this.headers})
      .toPromise()
      .then(response => response.json() as Attendee)
      .catch(this.handleError);
  }

  deleteAttendance(): Promise<void> {
    const url = `${this.serviceURL}/me`;
    this.headers.set('Authorization', 'Bearer ' + this.accountService.getAuth().access_token);
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
