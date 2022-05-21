import { Customer } from './customer';
export class Session {
    id?: string;
    customer?: Customer;
    schedule?: Date;
    value?: number;
    annotation?: string;
}
