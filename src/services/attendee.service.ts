import {Injectable} from '@angular/core';
import {Headers, Http} from '@angular/http';
import {environment} from '../environments/environment';
import {AccountService} from './account.service';

import 'rxjs/add/operator/toPromise';
import {Subject} from 'rxjs/Subject';

export class Attendee {
  public_id: string;
  first_name: string;
  last_name: string;
  home_country: string;
  profile_picture_url: string;
  next_event_attendance_status: boolean;
  attendance_count: number;
}

@Injectable()
export class AttendeeService {

  private serviceURL = environment.API_URL + '/api/v1/attendees';
  private headers = new Headers({'Content-Type': 'application/json'});
  public profile = new Subject<Attendee>();
  public profileLatest = new Attendee;
  profileObs$ = this.profile.asObservable();

  constructor(private http: Http, private accountService: AccountService) {
  }

  getAttendees(): Promise<Attendee[]> {
    return this.http.get(this.serviceURL)
      .toPromise()
      .then(response => response.json() as Attendee[])
      .catch(this.handleError);
  }

  loadUserProfile(): void {
    const url = `${this.serviceURL}/me`;
    this.headers.set('Authorization', 'Bearer ' + this.accountService.getAuth().access_token);
    this.http.get(url, {headers: this.headers})
      .toPromise()
      .then(response => this.profile.next(this.profileLatest = response.json() as Attendee))
      .catch(this.handleError);
  }

  setAttendance(): Promise<void> {
    const url = `${this.serviceURL}/me`;
    this.headers.set('Authorization', 'Bearer ' + this.accountService.getAuth().access_token);
    return this.http
      .post(url, {}, {headers: this.headers})
      .toPromise()
      .then(response => this.profile.next(this.profileLatest = response.json() as Attendee))
      .catch(this.handleError);
  }

  deleteAttendance(): Promise<void> {
    const url = `${this.serviceURL}/me`;
    this.headers.set('Authorization', 'Bearer ' + this.accountService.getAuth().access_token);
    return this.http.delete(url, {headers: this.headers})
      .toPromise()
      .then(() => {
        this.profileLatest.next_event_attendance_status = false;
        this.profile.next(this.profileLatest)
      })
      .catch(this.handleError);
  }

  private handleError(error: any): Promise<any> {
    console.error('An error occurred', error);
    return Promise.reject(error.message || error);
  }
}
