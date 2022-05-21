import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Customer } from '../api/customer';
import * as moment from 'moment';

@Injectable()
export class CustomerService {
    customerURL: string;

    constructor(private http: HttpClient) {}

    getCustomers() {
        const customer = this.http
            .get<any>('assets/demo/data/customers.json')
            .toPromise()
            .then((res) => res.data as Customer[])
            .then((data) => data);
        this.converterStringsParaDatas([customer]);
        return customer;
    }

    private converterStringsParaDatas(customers: any[]) {
        for (const customer of customers) {
            customer.birthDate = moment(
                customer.birthDate,
                'YYYY-MM-DD'
            ).toDate();
        }
    }

    update(customer: Customer): Promise<any> {
        const headers = new HttpHeaders().append(
            'Content-Type',
            'application/json'
        );

        return this.http
            .put(
                `${this.customerURL}/${customer.id}`,
                JSON.stringify(customer),
                { headers }
            )
            .toPromise()
            .then((response) => {
                const lancamento = JSON.parse(JSON.stringify(response));

                this.converterStringsParaDatas([lancamento]);

                return lancamento;
            });
    }

    create(customer: Customer): Promise<Customer> {
        const headers = new HttpHeaders().append(
            'Content-Type',
            'application/json'
        );

        return this.http
            .post(this.customerURL, JSON.stringify(customer), { headers })
            .toPromise()
            .then((response) => JSON.parse(JSON.stringify(response)));
    }

    delete(code: string): Promise<any> {
        return this.http
            .delete(`${this.customerURL}/${code}`)
            .toPromise()
            .then(() => null);
    }
}
