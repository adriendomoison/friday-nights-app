import {Directive, EventEmitter, Output} from '@angular/core';

@Directive({
    selector: '[ngModel][formatCreditCardNumber]',
    host: {
        "(input)": 'onInputChange($event)'
    }
})
export class CreditCardNumberDirective {

    @Output() ngModelChange: EventEmitter<any> = new EventEmitter();
    creditCardNumber: any;

    constructor() {
    }

    onInputChange($event) {
        this.creditCardNumber = $event.target.value.replace(/ /g,'').match(/[\s\S]{1,4}/g) || [];
        this.ngModelChange.emit(this.creditCardNumber.join(' '))
    }
}
