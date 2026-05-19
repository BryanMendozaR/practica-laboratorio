import {HttpClient} from '@angular/common/http';
import {Component} from '@angular/core';
import {Router} from '@angular/router';
import {AuthService} from '@auth0/auth0-angular';
import {firstValueFrom} from 'rxjs';

@Component({
  selector: 'app-history',
  templateUrl: './history.component.html',
  styleUrl: './history.component.scss'
})
export class HistoryComponent {
  transfers: any[] = [];
  loading: boolean = false;
  error: string = '';

  constructor(
    private http: HttpClient,
    public auth: AuthService,
    private router: Router
  ) { }

  async ngOnInit() {
    await this.loadHistory();
  }

  async loadHistory() {
    this.loading = true;
    this.error = '';

    try {
      const token = await firstValueFrom(
        this.auth.getAccessTokenSilently({
          authorizationParams: {
            audience: 'https://transfer-api',
            scope: 'transactions:transfer'
          }
        })
      );

      const headers = {Authorization: `Bearer ${token}`};

      this.http.get("http://localhost:8080/api/transfers/history", {headers})
        .subscribe({
          next: (res: any) => {
            this.transfers = Array.isArray(res) ? res : [];
            this.loading = false;
          },
          error: (err) => {
            console.error(err);
            this.error = 'Error al obtener el historial de transferencias.';
            this.loading = false;
          }
        });
    } catch (e) {
      console.error(e);
      this.error = 'Error obteniendo token de autenticación.';
      this.loading = false;
    }
  }

  goDashboard() {
    this.router.navigate(['/autenticacion/dashboard']);
  }
}
