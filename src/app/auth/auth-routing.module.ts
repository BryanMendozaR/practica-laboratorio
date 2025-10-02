import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {InicioSesionPageComponent} from './pages/inicio-sesion-page/inicio-sesion-page.component';
import {TransferenciaComponent} from './pages/transferencia/transferencia.component';

const routes: Routes = [
    {
        path: 'IniciarSesion',
        component: InicioSesionPageComponent
    },
    {
        path: 'transferencia',
        component: TransferenciaComponent
    },
    {
        path: '**',
        redirectTo: 'IniciarSesion'
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class AuthRoutingModule { }
