import { Component, OnInit } from '@angular/core';
import { ConfirmationService, MessageService } from 'primeng/api';
import * as moment from 'moment';
import { PaymentMethodService } from '../../../service/payment-method-service';
import { PaymentMethod } from '../../../api/paymentMethod';
import { SessionService } from '../../../service/sessionservice';
import { Session } from '../../../api/session';
import { CustomerService } from '../../../service/customerservice';
import { Customer } from '../../../api/customer';

@Component({
    selector: 'app-session',
    providers: [MessageService, ConfirmationService],
    templateUrl: './session.component.html',
})
export class SessionComponent implements OnInit {
    sessionDialog: boolean;

    exportColumns: any[] = [];

    deleteSessionDialog: boolean = false;

    sendContractDialog: boolean = false;

    sessions: Session[];

    session: Session;

    text: string;

    submitted: boolean;

    cols: any[];

    paymentMethods: PaymentMethod[];

    selectedPaymentMethods: PaymentMethod[];

    statuses: any[];

    customers: Customer[];

    rowsPerPageOptions = [5, 10, 20];

    constructor(
        private service: SessionService,
        private customerService: CustomerService,
        private messageService: MessageService,
        private confirmationService: ConfirmationService
    ) {}

    ngOnInit() {
        this.getAll();
        this.getAllCustomer();
        this.selectedPaymentMethods = [];
        this.cols = [
            { field: 'id', header: 'Id' },
            { field: 'customer', header: 'Paciente' },
            { field: 'phone', header: 'Telefone' },
            { field: 'schedule', header: 'Data' },
            { field: 'actions', header: 'Ações' },
        ];

        this.exportColumns = this.cols
            .filter((col) => col.field !== 'actions')
            .map((col) => ({ title: col.header, dataKey: col.field }));
    }

    private getAllCustomer() {
        this.customerService.getCustomers().then((data) => {
            this.customers = data;
        });
    }

    private getAll() {
        this.service.getSessions().then((data) => {
            this.sessions = data;
        });
    }

    openNew() {
        this.session = {};
        this.submitted = false;
        this.sessionDialog = true;
    }

    deleteSelectedProducts() {
        this.deleteSessionDialog = true;
    }

    editProduct(edit: Session) {
        edit.schedule = new Date(moment(edit.schedule).format('MM/DD/YYYY'));

        this.session = { ...edit };
        this.sessionDialog = true;
    }

    deleteProduct(session: Session) {
        this.deleteSessionDialog = true;
        this.session = { ...session };
    }

    confirmDelete() {
        this.deleteSessionDialog = false;
        this.service
            .delete(this.session.id)
            .then(() => {
                this.messageService.add({
                    severity: 'success',
                    summary: 'Sucesso',
                    detail: 'Paciente deletado com sucesso',
                    life: 3000,
                });
                this.session = {};
                this.getAll();
            })
            .catch((error) => {
                this.messageService.add({
                    severity: 'error',
                    detail: 'Não conseguimos deletar o Paciente',
                });
            });
    }

    sendContract(session: Session) {
        this.sendContractDialog = true;
        this.session = { ...session };
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
        this.sessionDialog = false;
        this.submitted = false;
    }

    saveProduct() {
        this.submitted = true;
        console.log(this.session);

        if (this.session.customer.name.trim()) {
            if (this.session.id) {
                this.update();
            } else {
                this.create();
            }

            this.sessions = [...this.sessions];
            this.sessionDialog = false;
            this.session = {};
            this.getAll();
        }
    }

    private create() {
        this.service
            .create(this.session)
            .then(() => {
                this.sessions.push(this.session);
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
            .update(this.session)
            .then(() => {
                this.sessions[this.findIndexById(this.session.id)] =
                    this.session;
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
        for (let i = 0; i < this.sessions.length; i++) {
            if (this.sessions[i].id === id) {
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

                doc.autoTable(this.exportColumns, this.sessions);
                doc.text(
                    'Listagem de Sessões no dia ' +
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
                    'Sessões-' +
                        moment(new Date()).format('DD-MM-YYYY') +
                        '.pdf'
                );
            });
        });
    }
}
