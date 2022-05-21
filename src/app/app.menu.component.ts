import { Component, OnInit } from '@angular/core';
import { AppMainComponent } from './app.main.component';
import { MenuItem } from 'primeng/api';

@Component({
    selector: 'app-menu',
    template: `
        <div class="layout-menu-container">
            <ul class="layout-menu" role="menu" (keydown)="onKeydown($event)">
                <li
                    app-menu
                    class="layout-menuitem-category"
                    *ngFor="let item of model; let i = index"
                    [item]="item"
                    [index]="i"
                    [root]="true"
                    role="none"
                >
                    <div
                        class="layout-menuitem-root-text"
                        [attr.aria-label]="item.label"
                    >
                        {{ item.label }}
                    </div>
                    <ul role="menu">
                        <li
                            app-menuitem
                            *ngFor="let child of item.items"
                            [item]="child"
                            [index]="i"
                            role="none"
                        ></li>
                    </ul>
                </li>
            </ul>
        </div>
    `,
})
export class AppMenuComponent implements OnInit {
    model: any[];
    itemsProfile: MenuItem[];

    constructor(public appMain: AppMainComponent) {}

    ngOnInit() {
        this.model = [
            {
                label: 'Inicio',
                items: [
                    {
                        label: 'Dashboard',
                        icon: 'pi pi-fw pi-home',
                        routerLink: ['/'],
                    },
                ],
            },
            {
                label: 'Meu Consultorio',
                items: [
                    {
                        label: 'Sessão',
                        icon: 'pi pi-fw pi-id-card',
                        routerLink: ['/session'],
                    },
                    {
                        label: 'Pacientes',
                        icon: 'pi pi-fw pi-users',
                        routerLink: ['/customer'],
                    },
                ],
            },
            {
                label: 'Gerencial',
                items: [
                    {
                        label: 'Tipo de Pagamentos',
                        icon: 'pi pi-fw pi-money-bill',
                        routerLink: ['manager/payment-methods'],
                    },
                    {
                        label: 'Meus Dados',
                        icon: 'pi pi-fw pi-user-edit',
                        routerLink: ['manager/company'],
                    },
                    {
                        label: 'Parametros',
                        icon: 'pi pi-fw pi-sliders-h',
                        routerLink: ['manager/params'],
                    },
                ],
            },
        ];

        this.itemsProfile = [
            {
                label: 'File',
                items: [
                    {
                        label: 'New',
                        icon: 'pi pi-fw pi-plus',
                        items: [{ label: 'Project' }, { label: 'Other' }],
                    },
                    { label: 'Open' },
                    { label: 'Quit' },
                ],
            },
            {
                label: 'Edit',
                icon: 'pi pi-fw pi-pencil',
                items: [
                    { label: 'Delete', icon: 'pi pi-fw pi-trash' },
                    { label: 'Refresh', icon: 'pi pi-fw pi-refresh' },
                ],
            },
        ];
    }

    onKeydown(event: KeyboardEvent) {
        const nodeElement = <HTMLDivElement>event.target;
        if (event.code === 'Enter' || event.code === 'Space') {
            nodeElement.click();
            event.preventDefault();
        }
    }
}
