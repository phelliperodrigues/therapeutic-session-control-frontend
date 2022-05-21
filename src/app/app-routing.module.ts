import { RouterModule } from '@angular/router';
import { NgModule } from '@angular/core';
import { DashboardComponent } from './components/application/dashboard/dashboard.component';
import { AppMainComponent } from './app.main.component';
import { SessionComponent } from './components/attendance/session/session.component';
import { CustomerComponent } from './components/attendance/customer/customer.component';
import { PaymentMethodComponent } from './components/manager/payment-method/payment-method.component';
import { LoginComponent } from './components/application/login/login.component';
import { NotfoundComponent } from './components/application/notfound/notfound.component';
import { CompanyComponent } from './components/manager/company/company.component';
import { ParametersComponent } from './components/manager/parameters/parameters.component';
@NgModule({
    imports: [
        RouterModule.forRoot(
            [
                {
                    path: '',
                    component: AppMainComponent,
                    children: [
                        { path: '', component: DashboardComponent },
                        {
                            path: 'uikit/menu',
                            loadChildren: () =>
                                import(
                                    './components/application/menus/menus.module'
                                ).then((m) => m.MenusModule),
                        },
                        { path: 'session', component: SessionComponent },
                        { path: 'customer', component: CustomerComponent },
                        {
                            path: 'manager/payment-methods',
                            component: PaymentMethodComponent,
                        },
                        {
                            path: 'manager/company',
                            component: CompanyComponent,
                        },
                        {
                            path: 'manager/params',
                            component: ParametersComponent,
                        },
                    ],
                },
                { path: 'pages/login', component: LoginComponent },
                { path: 'pages/notfound', component: NotfoundComponent },
                { path: '**', redirectTo: 'pages/notfound' },
            ],
            { scrollPositionRestoration: 'enabled', anchorScrolling: 'enabled' }
        ),
    ],
    exports: [RouterModule],
})
export class AppRoutingModule {}
