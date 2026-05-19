
import {Component, OnInit} from '@angular/core';
import {Router} from '@angular/router';
import {AuthService} from '@auth0/auth0-angular';
import {AuthTokenService} from '../../../services/auth-token.service';

@Component({
  selector: 'app-inicio-sesion-page',
  templateUrl: './inicio-sesion-page.component.html',
  styleUrl: './inicio-sesion-page.component.scss'
})
export class InicioSesionPageComponent implements OnInit {

  constructor(
    public auth: AuthService,
    private authToken: AuthTokenService,
    private router: Router
  ) { }

  ngOnInit() {
    this.auth.handleRedirectCallback().subscribe({
      next: (result) => {
        const target = result?.appState?.target || '/autenticacion/dashboard';
        this.router.navigateByUrl(target);
      },
      error: () => {
        //this.router.navigateByUrl('/autenticacion/dashboard');
      }
    });
  }

  login() {
    this.authToken.loginWithRedirect({
      appState: {
        target: '/autenticacion/dashboard'
      }
    });
  }
}
