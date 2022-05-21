import { Component, OnInit } from '@angular/core';
import { ConfirmationService, MessageService } from 'primeng/api';
import { Customer } from '../../../api/customer';
import * as moment from 'moment';
import { PaymentMethodService } from '../../../service/payment-method-service';
import { PaymentMethod } from '../../../api/paymentMethod';
import { SessionService } from '../../../service/sessionservice';

@Component({
    selector: 'app-session',
    providers: [MessageService, ConfirmationService],
    templateUrl: './session.component.html',
})
export class SessionComponent implements OnInit {
    customerDialog: boolean;

    exportColumns: any[] = [];

    deleteCustomerDialog: boolean = false;

    sendContractDialog: boolean = false;

    customers: Customer[];

    customer: Customer;

    text: string;

    submitted: boolean;

    cols: any[];

    paymentMethods: PaymentMethod[];

    selectedPaymentMethods: PaymentMethod[];

    statuses: any[];

    maritalStatus = [];

    rowsPerPageOptions = [5, 10, 20];

    constructor(
        private service: SessionService,
        private paymentMethodService: PaymentMethodService,
        private messageService: MessageService,
        private confirmationService: ConfirmationService
    ) {}

    ngOnInit() {
        this.maritalStatus = [
            { name: 'Casado', code: 'CASADO' },
            { name: 'Solteiro', code: 'SOLTEIRO' },
            { name: 'Divorciado', code: 'DIVORCIADO' },
            { name: 'Viuvo', code: 'VIUVO' },
            { name: 'Amasiado', code: 'AMASIADO' },
        ];
        this.getAll();
        this.getAllPaymentMethods();
        this.selectedPaymentMethods = [];
        this.cols = [
            { field: 'id', header: 'Id' },
            { field: 'name', header: 'Nome' },
            { field: 'address', header: 'Cidade' },
            { field: 'contact', header: 'Telefone' },
            { field: 'actions', header: 'Ações' },
        ];

        this.exportColumns = this.cols
            .filter((col) => col.field !== 'actions')
            .map((col) => ({ title: col.header, dataKey: col.field }));
    }

    private getAll() {
        this.service.getSessions().then((data) => {
            this.customers = data;
        });
    }

    getAllPaymentMethods() {
        this.paymentMethodService
            .getPaymentMethods()
            .then((data) => (this.paymentMethods = data));
    }

    openNew() {
        this.customer = {};
        this.customer.contact = {};
        this.customer.address = {};
        this.submitted = false;
        this.customerDialog = true;
    }

    deleteSelectedProducts() {
        this.deleteCustomerDialog = true;
    }

    editProduct(edit: Customer) {
        edit.birthDate = new Date(moment(edit.birthDate).format('MM/DD/YYYY'));
        this.customer = { ...edit };
        this.selectedPaymentMethods = [...this.customer.paymentMethods];
        this.customerDialog = true;
    }

    deleteProduct(customer: Customer) {
        this.deleteCustomerDialog = true;
        this.customer = { ...customer };
    }

    confirmDelete() {
        this.deleteCustomerDialog = false;
        this.service
            .delete(this.customer.id)
            .then(() => {
                this.messageService.add({
                    severity: 'success',
                    summary: 'Sucesso',
                    detail: 'Paciente deletado com sucesso',
                    life: 3000,
                });
                this.customer = {};
                this.getAll();
            })
            .catch((error) => {
                this.messageService.add({
                    severity: 'error',
                    detail: 'Não conseguimos deletar o Paciente',
                });
            });
    }

    sendContract(customer: Customer) {
        this.sendContractDialog = true;
        this.customer = { ...customer };
    }
    confirmSendContract() {
        this.sendContractDialog = false;
        this.messageService.add({
            severity: 'success',
            summary: 'Sucesso',
            detail: 'Contrato enviado!',
            life: 3000,
        });
    }

    generateContract() {
        this.messageService.add({
            severity: 'success',
            summary: 'Sucesso',
            detail: 'Contrato gerado!',
            life: 3000,
        });
    }
    hideDialog() {
        this.customerDialog = false;
        this.submitted = false;
    }

    saveProduct() {
        this.submitted = true;

        if (this.customer.name.trim()) {
            console.log(this.selectedPaymentMethods);

            this.customer.paymentMethods = this.selectedPaymentMethods;
            if (this.customer.id) {
                this.update();
            } else {
                this.create();
            }

            this.customers = [...this.customers];
            this.customerDialog = false;
            this.customer = {};
            this.getAll();
        }
    }

    private create() {
        this.service
            .create(this.customer)
            .then(() => {
                this.customers.push(this.customer);
                this.messageService.add({
                    severity: 'success',
                    summary: 'Sucesso',
                    detail: 'Paciente criado com sucesso',
                    life: 3000,
                });
            })
            .catch((error) => {
                this.messageService.add({
                    severity: 'error',
                    detail: 'Não conseguimos insetir o paciente',
                });
            });
    }

    private update() {
        this.service
            .update(this.customer)
            .then(() => {
                this.customers[this.findIndexById(this.customer.id)] =
                    this.customer;
                this.messageService.add({
                    severity: 'success',
                    summary: 'Sucesso',
                    detail: 'Paciente autalizado com sucesso',
                    life: 3000,
                });
            })
            .catch((error) => {
                this.messageService.add({
                    severity: 'error',
                    detail: 'Não conseguimos atualizar o paciente',
                });
            });
    }

    findIndexById(id: string): number {
        let index = -1;
        for (let i = 0; i < this.customers.length; i++) {
            if (this.customers[i].id === id) {
                index = i;
                break;
            }
        }

        return index;
    }

    exportPdf() {
        import('jspdf').then((jsPDF) => {
            import('jspdf-autotable').then((x) => {
                // @ts-ignore
                // eslint-disable-next-line new-cap
                const doc = new jsPDF.default('l', 0, 0);
                // @ts-ignore

                doc.autoTable(this.exportColumns, this.customers);
                doc.text(
                    'Listagem de Pacientes no dia ' +
                        moment(new Date()).format('DD/MM/YYYY'),
                    90,
                    10
                );

                doc.setProperties({
                    title:
                        'Listagem de Pacientes no dia ' +
                        moment(new Date()).format('DD-MM-YYYY'),
                    author: 'Sistema de gestão de sessões',
                });
                doc.save(
                    'Pacientes-' +
                        moment(new Date()).format('DD-MM-YYYY') +
                        '.pdf'
                );
            });
        });
    }
}
