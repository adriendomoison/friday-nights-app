import {Component} from '@angular/core';
import {PaymentService, Payment} from "../../services/payment.service";
import {AccountService} from "../../services/account.service";

@Component({
    selector: 'page-checkout',
    templateUrl: 'checkout.html',
    providers: [PaymentService]
})
export class CheckoutPage {

    payment: Payment;
    hasPaid: boolean;
    email: string;

    constructor(private paymentService: PaymentService, private accountService: AccountService) {
        this.hasPaid = false;
    }

    ionViewDidLoad() {
        console.log('ionViewDidLoad CheckoutPage');
    }

    ngOnInit() {
        this.accountService.retrieveAccessToken().then(() => {
            this.accountService.getCurrentUser()
                .then(user => {
                    this.email = user.email;
                });
        });
    }

    openCheckout() {
        let handler = (<any>window).StripeCheckout.configure({
            key: 'pk_test_zwIAgDm4FPAsHicdkA2nefMm',
            locale: 'auto',
            token: (token: any) => {
                this.hasPaid = true;
                let payment = new Payment;
                payment.token = token.id;
                this.paymentService.createPayment(payment)
                    .then((charged) => {
                        this.payment = charged;
                    });
            }
        });

        handler.open({
            name: 'angular-boot stripe',
            description: 'Pay for your item',
            amount: 500,
            email: this.email
        });
    }
}
