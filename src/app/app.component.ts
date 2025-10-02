import {Component, OnInit} from '@angular/core';
import {Router} from '@angular/router';
import {AuthService} from '@auth0/auth0-angular';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent implements OnInit {
  title = 'practica-laboratorio';
  constructor(private auth: AuthService, private router: Router) { }

  ngOnInit(): void {
    this.auth.handleRedirectCallback().subscribe({
      next: (result) => {
        const target = result?.appState?.target || '/';
        this.router.navigate([target]);
      }
    });
  }
}
