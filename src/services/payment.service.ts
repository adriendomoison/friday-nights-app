import {Injectable} from '@angular/core';
import {Headers, Http} from '@angular/http';
import {environment} from '../environments/environment';

import 'rxjs/add/operator/toPromise';
import {AccountService} from './account.service';

export class Payment {
  token: string;
  amount: number;
  currency: string
}

export class PaymentCardInfo {
  public_id: string;

  constructor(public email?: string, public name?: string, public number?: string, public token?: string) {
  }
}

@Injectable()
export class PaymentService {

  private serviceURL = environment.API_URL + '/api/v1/customer';
  private headers = new Headers({'Content-Type': 'application/json'});

  constructor(private http: Http, private accountService: AccountService) {
  }

  createPayment(Payment: Payment): Promise<Payment> {
    return this.http
      .post(this.serviceURL + '/payments', JSON.stringify(Payment), {headers: this.headers})
      .toPromise()
      .then(res => res.json())
      .catch(this.handleError);
  }

  createCustomer(cardInfo: PaymentCardInfo): Promise<PaymentCardInfo> {
    return this.http
      .post(this.serviceURL + '/payment/cards', JSON.stringify(cardInfo), {headers: this.headers})
      .toPromise()
      .then(res => res.json())
      .catch(this.handleError);
  }

  createCardCharge(card_public_id: string): Promise<PaymentCardInfo> {
    let card = new PaymentCardInfo;
    card.public_id = card_public_id;
    return this.http
      .post(this.serviceURL + '/payment/card/charge',
        JSON.stringify(card),
        {headers: this.headers, withCredentials: true})
      .toPromise()
      .then(res => res.json())
      .catch(this.handleError);
  }

  getCards(): Promise<PaymentCardInfo[]> {
    const url = `${this.serviceURL}/payment/cards`;
    this.headers.set('Authorization', 'Bearer ' + this.accountService.getAuth().access_token);
    return this.http.get(url, {headers: this.headers, withCredentials: true})
      .toPromise()
      .then(response => response.json() as PaymentCardInfo[])
      .catch(this.handleError);
  }

  private handleError(error: any): Promise<any> {
    console.error('An error occurred', error);
    return Promise.reject(error.message || error);
  }
}
