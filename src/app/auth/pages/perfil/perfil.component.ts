import {Component, OnDestroy, OnInit} from '@angular/core';
import {AuthService} from '@auth0/auth0-angular';
import {Subject, takeUntil} from 'rxjs';
import {AuthTokenService} from '../../../services/auth-token.service';

@Component({
  selector: 'app-perfil',
  templateUrl: './perfil.component.html',
  styleUrl: './perfil.component.scss'
})
export class PerfilComponent implements OnInit, OnDestroy {
  accessToken: string = '';
  decodedToken: any = null;
  message: string = '';
  users: any = null;
  private destroy$ = new Subject<void>();

  constructor(
    public auth: AuthService,
    private authToken: AuthTokenService
  ) { }

  async ngOnInit(): Promise<void> {
    if (await this.authToken.isAuthenticated()) {
      await this.loadToken();
    }

    this.auth.user$
      .pipe(takeUntil(this.destroy$))
      .subscribe(user => {
        this.users = user;
      });
  }

  async loadToken() {
    try {
      this.accessToken = await this.authToken.getToken();
      this.decodedToken = this.authToken.decodeJwt(this.accessToken);
    } catch (err) {
      console.error(err);
      this.message = 'No se pudo obtener el token';
    }
  }
  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }

  copyToken() {
    if (!this.accessToken) return;

    navigator.clipboard.writeText(this.accessToken)
      .then(() => this.message = 'Token copiado al portapapeles')
      .catch(() => this.message = 'No se pudo copiar el token');
  }
}
