import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {DashboardComponent} from './pages/dashboard/dashboard.component';
import {HistoryComponent} from './pages/history/history.component';
import {InicioSesionPageComponent} from './pages/inicio-sesion-page/inicio-sesion-page.component';
import {PerfilComponent} from './pages/perfil/perfil.component';
import {TransferComponent} from './pages/transfer/transfer.component';

const routes: Routes = [
    {
        path: 'dashboard',
        component: DashboardComponent,
    },
    {
        path: 'transferencia',
        component: TransferComponent
    },
    {
        path: 'perfil',
        component: PerfilComponent
    },
    {
        path: 'historial',
        component: HistoryComponent
    },
    {
        path: 'iniciarSesion',
        component: InicioSesionPageComponent
    },
    {
        path: '**',
        redirectTo: 'iniciarSesion'
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class AuthRoutingModule { }
