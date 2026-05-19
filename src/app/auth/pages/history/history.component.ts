import {Component} from '@angular/core';
import {Router} from '@angular/router';
import {AuthService} from '@auth0/auth0-angular';
import {TransferService} from '../../../services/transfer.service';

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
    private transferService: TransferService,
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
      const res = await this.transferService.getHistory();
      this.transfers = Array.isArray(res) ? res : [];
    } catch (e) {
      console.error(e);
      this.error = 'Error al obtener el historial de transferencias.';
    } finally {
      this.loading = false;
    }
  }

  goDashboard() {
    this.router.navigate(['/autenticacion/dashboard']);
  }
}
