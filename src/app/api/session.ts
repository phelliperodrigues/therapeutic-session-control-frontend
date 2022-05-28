import { Customer } from './customer';
export interface Session {
    id?: string;
    customer?: any;
    schedule?: Date;
    value?: number;
    annotation?: string;
}
