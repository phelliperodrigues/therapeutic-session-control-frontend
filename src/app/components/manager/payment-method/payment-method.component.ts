import { Component, OnInit } from '@angular/core';
import * as moment from 'moment';
import { MessageService, ConfirmationService } from 'primeng/api';
import { PaymentMethodService } from 'src/app/service/payment-method-service';
import { PaymentMethod } from '../../../api/paymentMethod';

@Component({
    selector: 'app-payment-method',
    providers: [MessageService, ConfirmationService],
    templateUrl: './payment-method.component.html',
})
export class PaymentMethodComponent implements OnInit {
    paymentMethodDialog: boolean;
    exportColumns: any[] = [];

    deleteCustomerDialog: boolean = false;

    sendContractDialog: boolean = false;

    paymentMethods: PaymentMethod[];

    paymentMethod: PaymentMethod;

    submitted: boolean;

    cols: any[];

    statuses: any[];
    maritalStatus = [];

    rowsPerPageOptions = [5, 10, 20];

    constructor(
        private service: PaymentMethodService,
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
        this.cols = [
            { field: 'id', header: 'Id' },
            { field: 'description', header: 'Descrição' },
        ];

        this.exportColumns = this.cols
            .filter((col) => col.field !== 'actions')
            .map((col) => ({ title: col.header, dataKey: col.field }));
    }

    getAll() {
        this.service
            .getPaymentMethods()
            .then((data) => (this.paymentMethods = data));
    }

    openNew() {
        this.paymentMethod = {};
        this.submitted = false;
        this.paymentMethodDialog = true;
    }

    deleteSelectedPaymentMethods() {
        this.deleteCustomerDialog = true;
    }

    editPaymentMethod(edit: PaymentMethod) {
        this.paymentMethod = { ...edit };
        this.paymentMethodDialog = true;
    }

    deletePaymentMethod(paymentMethod: PaymentMethod) {
        this.deleteCustomerDialog = true;
        this.paymentMethod = { ...paymentMethod };
    }

    confirmDelete() {
        this.deleteCustomerDialog = false;
        this.service
            .delete(this.paymentMethod.id)
            .then(() => {
                this.messageService.add({
                    severity: 'success',
                    summary: 'Sucesso',
                    detail: 'Método de pagamento deletado com sucesso',
                    life: 3000,
                });
                this.paymentMethod = {};
                this.getAll();
            })
            .catch((error) => {
                this.messageService.add({
                    severity: 'error',
                    detail: 'Não conseguimos deletar o Método de pagamento deletado',
                });
            });
    }

    sendContract(paymentMethod: PaymentMethod) {
        this.sendContractDialog = true;
        this.paymentMethod = { ...paymentMethod };
    }

    hideDialog() {
        this.paymentMethodDialog = false;
        this.submitted = false;
    }

    savePaymentMethod() {
        this.submitted = true;

        if (this.paymentMethod.description.trim()) {
            if (this.paymentMethod.id) {
                this.update();
            } else {
                this.create();
            }

            this.paymentMethods = [...this.paymentMethods];
            this.paymentMethodDialog = false;
            this.paymentMethod = {};
        }
    }

    private create() {
        this.service
            .create(this.paymentMethod)
            .then(() => {
                this.paymentMethods.push(this.paymentMethod);
                this.messageService.add({
                    severity: 'success',
                    summary: 'Sucesso',
                    detail: 'Método de pagamento criado com sucesso',
                    life: 3000,
                });
                this.getAll();
            })
            .catch((error) => {
                this.messageService.add({
                    severity: 'error',
                    detail: 'Não conseguimos inserir o paciente',
                });
            });
    }

    private update() {
        this.service
            .update(this.paymentMethod)
            .then(() => {
                this.paymentMethods[this.findIndexById(this.paymentMethod.id)] =
                    this.paymentMethod;
                this.messageService.add({
                    severity: 'success',
                    summary: 'Sucesso',
                    detail: 'Método de pagamento autalizado com sucesso',
                    life: 3000,
                });
                this.getAll();
            })
            .catch((error) => {
                this.messageService.add({
                    severity: 'error',
                    detail: 'Não conseguimos atualizar o Método de pagamento',
                });
            });
    }

    findIndexById(id: string): number {
        let index = -1;
        for (let i = 0; i < this.paymentMethods.length; i++) {
            if (this.paymentMethods[i].id === id) {
                index = i;
                break;
            }
        }

        return index;
    }

    exportPdf() {
        import('jspdf').then((jsPDF) => {
            import('jspdf-autotable').then((x) => {
                console.log(this.paymentMethods);

                // @ts-ignore
                // eslint-disable-next-line new-cap
                const doc = new jsPDF.default('p', 0, 0);
                // @ts-ignore

                doc.autoTable(this.exportColumns, this.paymentMethods);
                doc.text(
                    'Listagem de Método de Pagamentos no dia ' +
                        moment(new Date()).format('DD/MM/YYYY'),
                    40,
                    10
                );

                doc.setProperties({
                    title:
                        'Listagem de Método de Pagamentos no dia ' +
                        moment(new Date()).format('DD-MM-YYYY'),
                    author: 'Sistema de gestão de sessões',
                });
                doc.save(
                    'Método de pagamento-' +
                        moment(new Date()).format('DD-MM-YYYY') +
                        '.pdf'
                );
            });
        });
    }
}
