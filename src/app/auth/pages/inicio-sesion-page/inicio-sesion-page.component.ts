
import {Component, OnInit} from '@angular/core';
import {Router} from '@angular/router';
import {AuthService} from '@auth0/auth0-angular';

@Component({
  selector: 'app-inicio-sesion-page',
  templateUrl: './inicio-sesion-page.component.html',
  styleUrl: './inicio-sesion-page.component.scss'
})
export class InicioSesionPageComponent implements OnInit {
  accessToken?: string;

  constructor(public auth: AuthService, private router: Router) { }

  ngOnInit() {
    this.auth.user$.subscribe(user => {
      console.log('Usuario logueado:', user);
      if (user !== null) {
        this.router.navigate(['/autenticacion/transferencia']);
      }
    });

    this.auth.idTokenClaims$.subscribe(c => console.log('ID Token:', c));
    this.auth.getAccessTokenSilently().subscribe(token => {
      console.log('Access Token:', token);
      this.accessToken = token;
    });

  }

  login() {
    this.auth.loginWithRedirect();
  }

  getToken() {
    this.auth.getAccessTokenSilently().subscribe(token => {
      this.accessToken = token;
      console.log('Access Token:', token);
    });
  }
}
