import {HttpClient} from '@angular/common/http';
import {Component, OnInit} from '@angular/core';
import {Router} from '@angular/router';
import {AuthService} from '@auth0/auth0-angular';
import {combineLatest, firstValueFrom} from 'rxjs';

@Component({
  selector: 'app-transferencia',
  templateUrl: './transferencia.component.html',
  styleUrl: './transferencia.component.scss'
})
export class TransferenciaComponent implements OnInit {
  otp = '';
  challengeSent = false;
  transactionResult: any;

  constructor(private http: HttpClient, public auth: AuthService, private router: Router) { }

  ngOnInit() {
    combineLatest([this.auth.isLoading$, this.auth.user$]).subscribe(
      ([loading, user]) => {
        if (!loading && user) {
          console.log('Usuario en transferencia:', user);
        }
      }
    );
  }

  async requestTransferToken(): Promise<void> {
    try {
      const token = await firstValueFrom(
        this.auth.getAccessTokenSilently({
          authorizationParams: {
            audience: 'https://localhost:7158/',
            scope: 'transactions:transfer'
          }
        })
      );

      console.log('Token obtenido:', token);

      const headers = {Authorization: `Bearer ${token}`};
      this.http.post('https://localhost:7158/transactions', {}, {headers})
        .subscribe(res => console.log(res));

    } catch (e: any) {
      console.warn('Se requiere MFA, redirigiendo...', e);
      await this.auth.loginWithRedirect({
        authorizationParams: {
          audience: 'https://localhost:7158/',
          scope: 'openid profile email transactions:transfer'
        },
        appState: {target: '/transferencia'} // Ruta exacta
      });
    }
  }

  logout() {
    this.auth.logout({logoutParams: {returnTo: window.location.origin}});
  }
}
