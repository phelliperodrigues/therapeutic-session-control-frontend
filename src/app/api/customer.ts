import { PaymentMethod } from './paymentMethod';
export interface Adreess {
    street?: string;
    number?: string;
    zipCode?: string;
    city?: string;
    district?: string;
    state?: string;
    complement?: string;
}

export interface Contact {
    phone?: string;
    contactPhone?: string;
    email?: string;
}

export interface Customer {
    id?: string;
    name?: string;
    documentNumber?: string;
    rg?: string;
    birthDate?: Date;
    maritalStatus?: string;
    nationality?: string;
    address?: Adreess;
    contact?: Contact;
    paymentMethods?: PaymentMethod[];
    expirationDay?: number;
    value?: number;
}
