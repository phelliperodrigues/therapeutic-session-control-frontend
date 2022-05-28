import { Component, OnInit } from '@angular/core';
import { MessageService } from 'primeng/api';
import { CompayService } from '../../../service/companyservice';
import { Company } from '../../../api/compant';

@Component({
    selector: 'app-company',
    providers: [MessageService],
    templateUrl: './company.component.html',
})
export class CompanyComponent implements OnInit {
    company: Company;
    submitted: boolean;

    constructor(
        private service: CompayService,
        private messageService: MessageService
    ) {}

    ngOnInit() {
        this.getCustomer();
        console.log(this.company);
    }

    private getCustomer() {
        this.service.getCompany().then((data) => (this.company = data));
    }

    save() {
        this.submitted = true;

        if (this.company.name.trim()) {
            if (this.company.id) {
                this.update();
            } else {
                this.create();
            }
        }
    }

    private create() {
        this.service
            .create(this.company)
            .then(() => {
                this.messageService.add({
                    severity: 'success',
                    summary: 'Sucesso',
                    detail: '"Meus Dados" criado com sucesso',
                    life: 3000,
                });
            })
            .catch((error) => {
                this.messageService.add({
                    severity: 'error',
                    detail: 'Não conseguimos inserir "Meus Dados"',
                });
            });
        this.getCustomer();
    }

    private update() {
        this.service
            .update(this.company)
            .then(() => {
                this.messageService.add({
                    severity: 'success',
                    summary: 'Sucesso',
                    detail: '"Meus Dados" autalizado com sucesso',
                    life: 3000,
                });
            })
            .catch((error) => {
                this.messageService.add({
                    severity: 'error',
                    detail: 'Não conseguimos atualizar "Meus Dados"',
                });
            });
        this.getCustomer();
    }
}
