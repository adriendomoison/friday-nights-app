import {Component, OnInit} from '@angular/core';
import {PaymentCardInfo, PaymentService} from '../../services/payment.service';
import {AccountService} from '../../services/account.service';

@Component({
  selector: 'list-cards',
  templateUrl: 'list-cards.component.html',
  providers: [PaymentService]
})
export class ListCardsComponent implements OnInit {

  cards: PaymentCardInfo[];
  card: string;
  hasCards: boolean;

  constructor(private accountService: AccountService, private paymentService: PaymentService) {
    this.hasCards = false;
  }

  ngOnInit() {
    this.accountService.retrieveAccessToken().then(() => {
      this.paymentService.getCards().then(paymentCards => {
        this.cards = paymentCards;
        if (this.cards.length > 0) {
          this.hasCards = true;
          this.card = paymentCards[0].public_id
        }
      });
    });
  }

  chargeCard(): void {
    this.paymentService.createCardCharge(this.card)
  }
}
