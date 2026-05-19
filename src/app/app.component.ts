import {Component, inject} from '@angular/core';
import {Router} from '@angular/router';
import {AuthService} from '@auth0/auth0-angular';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
  title = 'practica-laboratorio';

  protected readonly window = window;
  protected auth = inject(AuthService);
  protected router = inject(Router);

  ngOnInit() {
    this.auth.handleRedirectCallback().subscribe({
      next: (result) => {
        // recupera la ruta donde estaba el usuario
        const target =
          result?.appState?.target || '/autenticacion/dashboard';

        // IMPORTANTE: usar navigateByUrl (no navigate)
        this.router.navigateByUrl(target);
      },
      error: () => {

      }
    });
  }
}
