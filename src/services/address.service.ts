import {Injectable} from '@angular/core';
import {Headers, Http} from '@angular/http';
import {environment} from '../environments/environment';

import 'rxjs/add/operator/toPromise';

export class Address {
  public_id: string;
  country: string;
  name_line: string;
  administrative_area: string;
  locality: string;
  postal_code: string;
  thoroughfare: string;
  premise: string;
}

@Injectable()
export class AddressService {

  private serviceURL = environment.API_URL + '/api/v1/address';
  private headers = new Headers({'Content-Type': 'application/json'});

  constructor(private http: Http) {
  }

  getAddress(public_id: string): Promise<Address> {
    const url = `${this.serviceURL}/${public_id}`;
    return this.http.get(url, {headers: this.headers})
      .toPromise()
      .then(response => response.json() as Address)
      .catch(this.handleError);
  }

  updateAddress(address: Address): Promise<Address> {
    const url = `${this.serviceURL}/${address.public_id}`;
    return this.http
      .put(url, JSON.stringify(address), {headers: this.headers})
      .toPromise()
      .then(response => response.json() as Address)
      .catch(this.handleError);
  }

  createAddress(address: Address): Promise<Address> {
    return this.http
      .post(this.serviceURL, JSON.stringify(address), {headers: this.headers})
      .toPromise()
      .then(res => res.json())
      .catch(this.handleError);
  }

  deleteAddress(public_id: string): Promise<void> {
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
