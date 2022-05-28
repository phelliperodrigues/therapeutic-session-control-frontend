import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import * as moment from 'moment';
import { Company } from '../api/compant';

@Injectable()
export class CompayService {
    companyUrl: string;

    constructor(private http: HttpClient) {}

    getCompany() {
        const company = this.http
            .get<any>('assets/demo/data/company.json')
            .toPromise()
            .then((res) => res.data as Company)
            .then((data) => data);
        return company;
    }

    update(company: Company): Promise<any> {
        const headers = new HttpHeaders().append(
            'Content-Type',
            'application/json'
        );

        return this.http
            .put(`${this.companyUrl}/${company.id}`, JSON.stringify(company), {
                headers,
            })
            .toPromise()
            .then((response) => {
                const company = JSON.parse(JSON.stringify(response));
                return company;
            });
    }

    create(company: Company): Promise<Company> {
        const headers = new HttpHeaders().append(
            'Content-Type',
            'application/json'
        );

        return this.http
            .post(this.companyUrl, JSON.stringify(company), {
                headers,
            })
            .toPromise()
            .then((response) => JSON.parse(JSON.stringify(response)));
    }

    delete(code: string): Promise<any> {
        return this.http
            .delete(`${this.companyUrl}/${code}`)
            .toPromise()
            .then(() => null);
    }
}
