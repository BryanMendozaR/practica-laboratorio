import {NgModule} from '@angular/core';
import {BrowserModule} from '@angular/platform-browser';
import {provideAnimationsAsync} from '@angular/platform-browser/animations/async';
import {AuthModule} from '@auth0/auth0-angular';
import {AppRoutingModule} from './app-routing.module';
import {AppComponent} from './app.component';
import {AuthenticacionModule} from './auth/auth.module';

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    AuthenticacionModule,
    AuthModule.forRoot({
      domain: 'dev-eky1z83d5zy7xss7.us.auth0.com', // tu dominio Auth0
      clientId: '5s9jdumlQe65D45ZVH7qMzTdJE9P39LW',            // tu Client ID
      authorizationParams: {
        redirect_uri: window.location.origin,
        audience: 'https://localhost:7158/',
        scope: 'openid profile email offline_access'
      },
      cacheLocation: 'localstorage',  // ← Muy importante para mantener sesión tras refresh
      useRefreshTokens: true          // ← Permite renovar tokens silenciosamente
    }),
  ],
  providers: [
    provideAnimationsAsync()
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
