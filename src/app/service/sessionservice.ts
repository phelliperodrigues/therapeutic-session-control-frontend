import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import * as moment from 'moment';
import { Session } from '../api/session';

@Injectable()
export class SessionService {
    sessionURL: string;

    constructor(private http: HttpClient) {}

    getSessions() {
        const session = this.http
            .get<any>('assets/demo/data/sessions.json')
            .toPromise()
            .then((res) => res.data as Session[])
            .then((data) => data);
        this.converterStringsParaDatas([session]);
        return session;
    }

    private converterStringsParaDatas(sessions: any[]) {
        for (const session of sessions) {
            session.schedule = moment(session.schedule, 'YYYY-MM-DD').toDate();
        }
    }

    update(session: Session): Promise<any> {
        const headers = new HttpHeaders().append(
            'Content-Type',
            'application/json'
        );

        return this.http
            .put(`${this.sessionURL}/${session.id}`, JSON.stringify(session), {
                headers,
            })
            .toPromise()
            .then((response) => {
                const lancamento = JSON.parse(JSON.stringify(response));

                this.converterStringsParaDatas([lancamento]);

                return lancamento;
            });
    }

    create(session: Session): Promise<Session> {
        const headers = new HttpHeaders().append(
            'Content-Type',
            'application/json'
        );

        return this.http
            .post(this.sessionURL, JSON.stringify(session), { headers })
            .toPromise()
            .then((response) => JSON.parse(JSON.stringify(response)));
    }

    delete(code: string): Promise<any> {
        return this.http
            .delete(`${this.sessionURL}/${code}`)
            .toPromise()
            .then(() => null);
    }
}
