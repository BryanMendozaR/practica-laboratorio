import {HttpClient} from '@angular/common/http';
import {Component, OnInit} from '@angular/core';
import {Router} from '@angular/router';
import {AuthService} from '@auth0/auth0-angular';
import emailjs from 'emailjs-com';
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
  email = 'brianalfredomr@gmail.com';
  generatedOtp = '';
  message = '';
  isSent = false;

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

  sendOtp() {
    if (!this.email) {
      this.message = 'Por favor ingresa tu correo electrónico.';
      return;
    }

    this.generatedOtp = Math.floor(100000 + Math.random() * 900000).toString();
    console.log(this.generatedOtp);

    const expiry = new Date(Date.now() + 15 * 60000);
    const time = `${expiry.getHours().toString().padStart(2, '0')}:${expiry.getMinutes().toString().padStart(2, '0')}`;

    const templateParams = {
      email: this.email,
      otp: this.generatedOtp,
      time: time
    };

    emailjs.send('service_waje3dw', 'template_pln38su', templateParams, 'HtugGSrBlfugiADY1')
      .then(() => {
        this.isSent = true;
        this.message = 'OTP enviado correctamente ';
        setTimeout(() => this.generatedOtp = '', 15 * 60 * 1000);
      })
      .catch((err: any) => {
        console.error('Error enviando correo:', err);
        this.message = 'Error al enviar el correo';
      });
  }

  verifyOtp() {
    if (!this.generatedOtp) {
      this.message = ' El código ha expirado. Solicita uno nuevo.';
      this.isSent = false;
      return;
    }

    if (this.otp === this.generatedOtp) {
      this.message = 'OTP correcto. Transferencia autorizada.';
    } else {
      this.message = ' OTP incorrecto. Intenta nuevamente.';
    }
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

  enviarOtp() {

  }

  logout() {
    this.auth.logout({logoutParams: {returnTo: window.location.origin}});
  }
}
