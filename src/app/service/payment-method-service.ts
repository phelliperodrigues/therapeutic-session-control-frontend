import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import * as moment from 'moment';
import { PaymentMethod } from '../api/paymentMethod';

@Injectable()
export class PaymentMethodService {
    paymentMethodURL: string;

    constructor(private http: HttpClient) {}

    getPaymentMethods() {
        const paymentMethod = this.http
            .get<any>('assets/demo/data/payment-method.json')
            .toPromise()
            .then((res) => res.data as PaymentMethod[])
            .then((data) => data);
        this.converterStringsParaDatas([paymentMethod]);
        return paymentMethod;
    }

    private converterStringsParaDatas(paymentMethods: any[]) {
        for (const paymentMethod of paymentMethods) {
            paymentMethod.birthDate = moment(
                paymentMethod.birthDate,
                'YYYY-MM-DD'
            ).toDate();
        }
    }

    update(paymentMethod: PaymentMethod): Promise<any> {
        const headers = new HttpHeaders().append(
            'Content-Type',
            'application/json'
        );

        return this.http
            .put(
                `${this.paymentMethodURL}/${paymentMethod.id}`,
                JSON.stringify(paymentMethod),
                { headers }
            )
            .toPromise()
            .then((response) => {
                const lancamento = JSON.parse(JSON.stringify(response));

                this.converterStringsParaDatas([lancamento]);

                return lancamento;
            });
    }

    create(paymentMethod: PaymentMethod): Promise<PaymentMethod> {
        const headers = new HttpHeaders().append(
            'Content-Type',
            'application/json'
        );

        return this.http
            .post(this.paymentMethodURL, JSON.stringify(paymentMethod), {
                headers,
            })
            .toPromise()
            .then((response) => JSON.parse(JSON.stringify(response)));
    }

    delete(code: string): Promise<any> {
        return this.http
            .delete(`${this.paymentMethodURL}/${code}`)
            .toPromise()
            .then(() => null);
    }
}
