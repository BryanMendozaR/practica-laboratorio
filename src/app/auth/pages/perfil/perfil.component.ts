import {Component, OnInit} from '@angular/core';
import {AuthService} from '@auth0/auth0-angular';
import {firstValueFrom} from 'rxjs';

@Component({
  selector: 'app-perfil',
  templateUrl: './perfil.component.html',
  styleUrl: './perfil.component.scss'
})
export class PerfilComponent implements OnInit {
  accessToken: string = '';
  decodedToken: any = null;
  message: string = '';

  constructor(public auth: AuthService) { }

  async ngOnInit(): Promise<void> {
    const isAuth = await firstValueFrom(this.auth.isAuthenticated$);

    if (isAuth) {
      await this.loadToken();
    }
  }

  async loadToken() {
    try {
      this.accessToken = await firstValueFrom(
        this.auth.getAccessTokenSilently({
          authorizationParams: {
            audience: 'https://transfer-api',
            scope: 'openid profile email'
          }
        })
      );

      this.decodedToken = this.decodeJwt(this.accessToken);

    } catch (err) {
      console.error(err);
      this.message = 'No se pudo obtener el token';
    }
  }

  decodeJwt(token: string): any {
    try {
      const payload = token.split('.')[1];
      const decoded = atob(payload.replace(/-/g, '+').replace(/_/g, '/'));
      return JSON.parse(decoded);
    } catch (e) {
      return null;
    }
  }

  copyToken() {
    if (!this.accessToken) return;

    navigator.clipboard.writeText(this.accessToken)
      .then(() => this.message = 'Token copiado al portapapeles')
      .catch(() => this.message = 'No se pudo copiar el token');
  }
}
