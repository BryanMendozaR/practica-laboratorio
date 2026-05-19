import {Component, OnInit} from '@angular/core';
import {AuthService} from '@auth0/auth0-angular';
import {AuthTokenService} from '../../../services/auth-token.service';
import emailjs from 'emailjs-com';

@Component({
  selector: 'app-transferencia',
  templateUrl: './transferencia.component.html',
  styleUrl: './transferencia.component.scss'
})
export class TransferenciaComponent implements OnInit {
  otp = '';
  challengeSent = false;
  email = 'brianalfredomr@gmail.com';
  generatedOtp = '';
  message = '';
  isSent = false;

  constructor(
    public auth: AuthService,
    private authToken: AuthTokenService
  ) { }

  async ngOnInit() {
    if (await this.authToken.isAuthenticated()) {
      const token = await this.authToken.getToken('https://transfer-api', 'openid profile email transactions:transfer');
      console.log("TOKEN PARA POSTMAN:", token);
    }
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
      const token = await this.authToken.getToken('https://transfer-api', 'transactions:transfer');
      console.log('Token obtenido:', token);
    } catch {
      console.warn('Se requiere MFA, redirigiendo...');
      this.authToken.loginWithRedirect({
        audience: 'https://transfer-api',
        scope: 'openid profile email transactions:transfer',
        appState: {target: '/transferencia'}
      });
    }
  }

  enviarOtp() { }

  async solicitarTransferenciaConMFA() {
    this.authToken.loginWithRedirect({
      audience: 'https://transfer-api',
      scope: 'openid profile email transactions:transfer',
      appState: {target: '/transferencia'}
    });
  }

  logout() {
    this.authToken.logout();
  }
}
