import {Directive, EventEmitter, Output} from '@angular/core';

@Directive({
    selector: '[ngModel][formatCreditCardExpiration]',
    host: {
        "(input)": 'onInputChange($event)'
    }
})
export class CreditCardExpirationDirective {

    @Output() ngModelChange: EventEmitter<any> = new EventEmitter();
    creditCardExpiration: any;

    constructor() {
    }

    onInputChange($event) {
        this.creditCardExpiration = $event.target.value.replace(/ \/ /g, '').match(/[\s\S]{1,2}/g) || [];
        this.ngModelChange.emit(this.creditCardExpiration.join(' / '))
    }

}
