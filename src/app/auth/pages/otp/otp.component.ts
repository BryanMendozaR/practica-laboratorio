import {Component} from '@angular/core';
import emailjs from 'emailjs-com';

@Component({
  selector: 'app-otp',
  templateUrl: './otp.component.html',
  styleUrl: './otp.component.scss'
})
export class OtpComponent {
  email = 'brianalfredomr@gmail.com';
  otp = '';
  generatedOtp = '';
  message = '';
  isSent = false;
  expiryTime = '15';

  sendOtp() {
    if (!this.email) {
      this.message = 'Por favor ingresa tu correo electrónico.';
      return;
    }

    // Generar OTP de 6 dígitos
    this.generatedOtp = Math.floor(100000 + Math.random() * 900000).toString();

    // Calcular hora de expiración (+15 minutos)
    const expiry = new Date(Date.now() + 15 * 60000);
    const hours = expiry.getHours().toString().padStart(2, '0');
    const minutes = expiry.getMinutes().toString().padStart(2, '0');
    this.expiryTime = `${hours}:${minutes}`;

    // Parámetros según tu plantilla de EmailJS
    const templateParams = {
      to_email: this.email,
      'código de acceso': this.generatedOtp,
      time: this.expiryTime
    };

    // Enviar el correo con EmailJS
    emailjs.send('service_waje3dw', 'template_pln38su', templateParams, 'HtugGSrBlfugiADY1')
      .then(() => {
        this.isSent = true;
        this.message = 'OTP enviada correctamente. Revisa tu correo 📩';
        // Expirar OTP tras 15 min
        setTimeout(() => this.generatedOtp = '', 15 * 60 * 1000);
      })
      .catch((err) => {
        console.error('Error enviando correo:', err);
        this.message = 'Error al enviar el correo ';
      });
  }

  verifyOtp() {
    if (!this.generatedOtp) {
      this.message = ' El código ha expirado. Solicita uno nuevo.';
      this.isSent = false;
      return;
    }

    if (this.otp === this.generatedOtp) {
      this.message = ' OTP correcto. Verificación completada.';
    } else {
      this.message = ' OTP incorrecto. Intenta nuevamente.';
    }
  }
}
