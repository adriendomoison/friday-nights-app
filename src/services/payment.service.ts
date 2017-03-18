import {Injectable} from "@angular/core";
import {Headers, Http} from "@angular/http";
import {environment} from "../environments/environment";
import 'rxjs/add/operator/toPromise';

export class Payment {
    token_id: string;
    amount: number;
    currency: string
}

@Injectable()
export class PaymentService {

    private serviceURL = environment.API_URL + '/api/v1/payments';
    private headers = new Headers({'Content-Type': 'application/json'});

    constructor(private http: Http) {
    }

    createPayment(Payment: Payment): Promise<Payment> {
        return this.http
            .post(this.serviceURL, JSON.stringify(Payment), {headers: this.headers})
            .toPromise()
            .then(res => res.json())
            .catch(this.handleError);
    }

    deletePayment(public_id: string): Promise<void> {
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
