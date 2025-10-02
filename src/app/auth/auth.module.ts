import {CommonModule} from '@angular/common';
import {HttpClientModule} from '@angular/common/http';
import {NgModule} from '@angular/core';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {MaterialModule} from '../material/material.module';
import {AuthRoutingModule} from './auth-routing.module';
import {InicioSesionPageComponent} from './pages/inicio-sesion-page/inicio-sesion-page.component';
import {TransferenciaComponent} from './pages/transferencia/transferencia.component';

@NgModule({
  declarations: [
    InicioSesionPageComponent,
    TransferenciaComponent
  ],
  imports: [
    CommonModule,
    AuthRoutingModule,
    ReactiveFormsModule,
    MaterialModule,
    FormsModule,
    HttpClientModule
  ]
})
export class AuthenticacionModule { }
