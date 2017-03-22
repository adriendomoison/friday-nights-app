import {Component, OnInit, ViewChildren} from '@angular/core';
import {CustomerCardInfo, PaymentService, PaymentCard} from "../../services/payment.service";
import {AccountService} from "../../services/account.service";

@Component({
    selector: 'add-card',
    templateUrl: 'add-card.component.html',
    providers: [PaymentService]
})
export class AddCardComponent implements OnInit {

    paymentCard: PaymentCard;
    message: string;

    @ViewChildren('expiryDate') expiryDate;
    @ViewChildren('cvc') cvc;
    @ViewChildren('submit') submit;

    hasJumpedCardNumber: boolean = false;
    hasJumpedExpiryDate: boolean = false;
    hasJumpedCVC: boolean = false;

    constructor(private paymentService: PaymentService, private accountService: AccountService) {
        this.paymentCard = new PaymentCard;
        this.paymentCard.cardNumber = '';
        this.paymentCard.expiryDate = '';
        this.paymentCard.cvc = '';
    }

    ngOnInit() {
        this.accountService.retrieveAccessToken().then(() => {
            this.accountService.getCurrentUser()
                .then(user => {
                    this.paymentCard.email = user.email;
                });
        });
    }

    ngDoCheck() {
        if (this.paymentCard.cardNumber.length == 19 && !this.hasJumpedCardNumber) {
            this.hasJumpedCardNumber = true;
            this.expiryDate.first.nativeElement.focus();
        }
        if (this.paymentCard.expiryDate.length == 7 && !this.hasJumpedExpiryDate) {
            this.hasJumpedExpiryDate = true;
            this.cvc.first.nativeElement.focus();
        }
        if (this.paymentCard.cvc.length == 3 && !this.hasJumpedCVC) {
            this.hasJumpedCVC = true;
            this.submit.first.nativeElement.focus();
        }
    }

    getToken() {
        (<any>window).Stripe.card.createToken({
            number: this.paymentCard.cardNumber,
            exp_month: this.paymentCard.expiryDate.substring(0, 2),
            exp_year: this.paymentCard.expiryDate.substring(5, 7),
            cvc: this.paymentCard.cvc
        }, (status: number, response: any) => {
            if (status === 200) {
                this.paymentService.createCustomer(new CustomerCardInfo(
                    this.paymentCard.email,
                    this.paymentCard.cardName,
                    this.paymentCard.cardNumber,
                    response.id
                )).then(() => {
                });
            } else {
                console.log(response.error.message);
                this.message = "An error occurred";
            }
        });
    }
}
