import {Injectable} from '@angular/core';
import {AuthService} from '@auth0/auth0-angular';
import {firstValueFrom} from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthTokenService {

  constructor(private auth: AuthService) { }

  async getToken(audience: string = 'https://transfer-api', scope: string = 'openid profile email'): Promise<string> {
    return await firstValueFrom(
      this.auth.getAccessTokenSilently({
        authorizationParams: {audience, scope}
      })
    );
  }

  async isAuthenticated(): Promise<boolean> {
    return await firstValueFrom(this.auth.isAuthenticated$);
  }

  decodeJwt(token: string): any {
    try {
      const payload = token.split('.')[1];
      const decoded = atob(payload.replace(/-/g, '+').replace(/_/g, '/'));
      return JSON.parse(decoded);
    } catch {
      return null;
    }
  }

  loginWithRedirect(options?: {
    audience?: string;
    scope?: string;
    appState?: {target: string};
  }) {
    this.auth.loginWithRedirect({
      authorizationParams: {
        audience: options?.audience,
        scope: options?.scope
      },
      appState: options?.appState
    });
  }

  logout() {
    this.auth.logout({
      logoutParams: {
        returnTo: window.location.origin + '/autenticacion/iniciarSesion'
      }
    });
  }
}
