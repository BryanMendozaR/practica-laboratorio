import {Component} from '@angular/core';
import {Router} from '@angular/router';
import {AuthService} from '@auth0/auth0-angular';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss'
})
export class DashboardComponent {

  constructor(
    public auth: AuthService,
    private router: Router
  ) { }

  goToProfile() {
    this.router.navigate(['/autenticacion/perfil']);
  }

  goToTransfer() {
    this.router.navigate(['/autenticacion/transferencia']);
  }

  goToHistory() {
    this.router.navigate(['/autenticacion/historial']);
  }

  logout() {
    this.auth.logout({logoutParams: {returnTo: window.location.origin}});
  }

}
