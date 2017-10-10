import {Injectable} from '@angular/core';
import {Headers, Http, URLSearchParams} from '@angular/http';
import {environment} from '../environments/environment';
import {NativeStorage} from '@ionic-native/native-storage';
import 'rxjs/add/operator/toPromise';

export class Auth {
  access_token: string;
  refresh_token: string;
  scopes: string;
  expires_in: number;
}

export class Credentials {
  constructor(public username?: string, public password?: string) {
  }
}

export class Account {
  username: string;
  picture: string;
}

export class RideStatus {
  is_rider_to_ruth: boolean;
  is_rider_home: boolean;
  is_driver_to_ruth: boolean;
  is_driver_home: boolean;
}

export class UserNotificationToken {
  constructor(public email: string, public push_notification_token: string) {
  }
}

export class User {
  first_name: string;
  last_name: string;
  email: string;
  password: string;
  username: string;
  birthday: string;
  phone_number: string;
  profile_public_id: string;
  account_creation_date: string;
}

export class FacebookCredentials {
  constructor(public user_id?: string, public access_token?: string) {
  }
}

export class UserChangePassword {
  constructor(public email?: string, public password?: string, public new_password?: string) {
  }
}

@Injectable()
export class AccountService {

  private API_SERVICE_URL = environment.API_URL + '/api/v1';
  private headers = new Headers({'Content-Type': 'application/json'});
  private auth = new Auth();
  private account = new Account();
  public isConnected: boolean;

  constructor(private http: Http, private nativeStorage: NativeStorage) {
    this.isConnected = false;
  }

  getAuth(): Auth {
    return this.auth
  }

  connectFromRefreshToken(refresh_token: string): Promise<void> {
    const url = `${environment.API_URL}/appauth/refresh`;

    let params: URLSearchParams = new URLSearchParams();
    params.set('code', refresh_token);

    return this.http
      .get(url, {search: params, headers: this.headers})
      .toPromise()
      .then(res => {
        this.auth = res.json() as Auth;
        this.isConnected = true;
        return this.saveAccessToken()
      })
      .catch(this.handleError);
  }

  facebookSignIn(credentials: FacebookCredentials): Promise<void> {
    const url = `${environment.API_URL}/auth/facebook/login`;
    return this.http
      .post(url, JSON.stringify(credentials), {headers: this.headers})
      .toPromise()
      .then(res => {
        this.auth = res.json() as Auth;
        this.isConnected = true;
        return this.saveAccessToken()
      })
      .catch(this.handleError);
  }

  signIn(credentials: Credentials): Promise<void> {
    const url = `${environment.API_URL}/appauth/password`;

    let params: URLSearchParams = new URLSearchParams();
    params.set('email', credentials.username);
    params.set('password', credentials.password);
    params.set('client_id', 'fridaynights');

    return this.http
      .get(url, {search: params, headers: this.headers})
      .toPromise()
      .then(res => {
        this.auth = res.json() as Auth;
        this.isConnected = true;
        return this.saveAccessToken()
      })
      .catch(this.handleError);
  }

  signUp(user: User): Promise<void> {
    const url = `${this.API_SERVICE_URL}/users`;
    return this.http
      .post(url, JSON.stringify(user), {headers: this.headers})
      .toPromise()
      .then(() => {
        return this.signIn(new Credentials(user.email, user.password))
          .then()
      })
      .catch(this.handleError);
  }

  getCurrentUser(): Promise<User> {
    const url = `${this.API_SERVICE_URL}/user`;
    this.headers.set('Authorization', 'Bearer ' + this.auth.access_token);
    return this.http.get(url, {headers: this.headers})
      .toPromise()
      .then(response => response.json() as User)
      .catch(this.handleError);
  }

  updateUserAccount(user: User): Promise<User> {
    const url = `${this.API_SERVICE_URL}/user`;
    this.headers.set('Authorization', 'Bearer ' + this.auth.access_token);
    return this.http
      .put(url, JSON.stringify(user), {headers: this.headers})
      .toPromise()
      .then(response => response.json() as Account)
      .catch(this.handleError);
  }

  updateUserPassword(userChangePassword: UserChangePassword): Promise<User> {
    const url = `${this.API_SERVICE_URL}/user/password`;
    this.headers.set('Authorization', 'Bearer ' + this.auth.access_token);
    return this.http
      .put(url, JSON.stringify(userChangePassword), {headers: this.headers})
      .toPromise()
      .then(response => response.json() as Account)
      .catch(this.handleError);
  }

  deleteUserAccount(): Promise<void> {
    const url = `${this.API_SERVICE_URL}/user`;
    this.headers.set('Authorization', 'Bearer ' + this.auth.access_token);
    return this.http.delete(url, {headers: this.headers})
      .toPromise()
      .then()
      .catch(this.handleError);
  }

  disconnect(): Promise<void> {
    const url = `${environment.API_URL}/auth/access-token/delete`;

    let params: URLSearchParams = new URLSearchParams();
    params.set('access_token', this.auth.access_token);

    return this.http.get(url, {search: params, headers: this.headers})
      .toPromise()
      .then(() => {
        this.auth = new Auth();
        this.account = new Account();
      })
      .catch(this.handleError);
  }

  retrieveAccessToken(): Promise<void> {
    const url = `${environment.API_URL}/auth/access-token`;
    return this.http.get(url, {headers: this.headers})
      .toPromise()
      .then(res => {
        this.auth = res.json() as Auth;
        this.isConnected = res.status == 200;
      })
      .catch(this.handleError);
  }

  saveAccessToken(): Promise<void> {
    const url = `${environment.API_URL}/auth/access-token/set`;

    let params: URLSearchParams = new URLSearchParams();
    params.set('access_token', this.auth.access_token);

    return this.http.get(url, {search: params, headers: this.headers})
      .toPromise()
      .then(() => {
        this.nativeStorage.setItem('user', {refresh_token: this.auth.refresh_token}).then();
      })
  }

  updateNotificationToken(userNotificationToken: UserNotificationToken): Promise<User> {
    const url = `${environment.API_URL}/api/v1/user/notification-token`;
    this.headers.set('Authorization', 'Bearer ' + this.getAuth().access_token);
    return this.http
      .put(url, JSON.stringify(userNotificationToken), {headers: this.headers})
      .toPromise()
      .then(response => response.json() as User)
      .catch(this.handleError);
  }

  getUserRideStatus(): Promise<RideStatus> {
    const url = `${environment.API_URL}/api/v1/rides/status`;
    this.headers.set('Authorization', 'Bearer ' + this.getAuth().access_token);
    return this.http.get(url, {headers: this.headers})
      .toPromise()
      .then(response => response.json() as RideStatus)
      .catch(this.handleError);
  }

  private handleError(error: any): Promise<any> {
    return Promise.reject(error.message || error);
  }
}
