import {Injectable} from '@angular/core';
import {Headers, Http} from '@angular/http';
import {environment} from '../environments/environment';
import {AccountService} from './account.service';
import 'rxjs/add/operator/toPromise';

export class Profile {
  public_id: string;
  first_name: string;
  last_name: string;
  profile_picture_cloudinary_id: string;
  profile_picture_url: string;
  description: string;
}

@Injectable()
export class ProfileService {

  private serviceURL = environment.API_URL + '/api/v1/profiles';
  private headers = new Headers({'Content-Type': 'application/json'});

  constructor(private http: Http, private accountService: AccountService) {
  }

  getProfile(public_id: string): Promise<Profile> {
    const url = `${this.serviceURL}/${public_id}`;
    return this.http.get(url, {headers: this.headers})
      .toPromise()
      .then(response => response.json() as Profile)
      .catch(this.handleError);
  }

  updateProfile(profile: Profile): Promise<Profile> {
    const url = `${environment.API_URL}/api/v1/user/profile`;
    this.headers.set('Authorization', 'Bearer ' + this.accountService.getAuth().access_token);
    return this.http
      .put(url, JSON.stringify(profile), {headers: this.headers})
      .toPromise()
      .then(response => response.json() as Profile)
      .catch(this.handleError);
  }

  private handleError(error: any): Promise<any> {
    console.error('An error occurred', error);
    return Promise.reject(error.message || error);
  }
}
