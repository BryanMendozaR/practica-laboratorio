import {Component, inject} from '@angular/core';
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
}
