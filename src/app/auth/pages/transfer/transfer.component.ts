import {HttpClient} from '@angular/common/http';
import {Component} from '@angular/core';
import {Router} from '@angular/router';
import {AuthService} from '@auth0/auth0-angular';
import {firstValueFrom} from 'rxjs';

@Component({
  selector: 'app-transfer',
  templateUrl: './transfer.component.html',
  styleUrl: './transfer.component.scss'
})
export class TransferComponent {
  receiverEmail: string = '';
  amount: number = 0;
  description: string = '';

  otp: string = '';
  generatedOtp: string = '';

  otpSent: boolean = false;
  transferConfirmed: boolean = false;

  message: string = '';
  transferResult: any;

  constructor(
    private http: HttpClient,
    public auth: AuthService,
    private router: Router
  ) { }

  async ngOnInit() {
    const pending = localStorage.getItem("pending_transfer");

    if (pending) {
      const data = JSON.parse(pending);

      this.receiverEmail = data.receiverEmail;
      this.amount = data.amount;
      this.description = data.description;

      // ya no se necesita guardarlo
      localStorage.removeItem("pending_transfer");

      // aquí llamas al backend ya con token válido
      await this.executeTransfer();
    }
  }

  async executeTransfer() {
    const token = await firstValueFrom(
      this.auth.getAccessTokenSilently({
        authorizationParams: {
          audience: 'https://transfer-api',
          scope: 'transactions:transfer'
        }
      })
    );

    const headers = {Authorization: `Bearer ${token}`};

    this.http.post("http://localhost:8080/api/transfers", {
      receiverEmail: this.receiverEmail,
      amount: this.amount,
      description: this.description
    }, {headers}).subscribe({
      next: (res: any) => {
        this.transferResult = res;
        this.transferConfirmed = true;
      },
      error: () => {
        this.message = "Error al realizar transferencia";
      }
    });
  }

  async confirmTransfer() {
    this.message = '';

    if (!this.receiverEmail || !this.amount || this.amount <= 0) {
      this.message = 'Debes ingresar correo y monto válido.';
      return;
    }

    localStorage.setItem("pending_transfer", JSON.stringify({
      receiverEmail: this.receiverEmail,
      amount: this.amount,
      description: this.description
    }));

    await this.auth.loginWithRedirect({
      authorizationParams: {
        audience: 'https://transfer-api',
        scope: 'openid profile email transactions:transfer'
      },
      appState: {target: '/autenticacion/transferencia'}
    });
  }

  async verifyOtpAndTransfer() {
    this.message = '';

    if (this.otp !== this.generatedOtp) {
      this.message = 'OTP incorrecto.';
      return;
    }

    try {
      const token = await firstValueFrom(
        this.auth.getAccessTokenSilently({
          authorizationParams: {
            audience: 'https://transfer-api',
            scope: 'openid profile email'
          }
        })
      );

      const body = {
        receiverEmail: this.receiverEmail,
        amount: this.amount,
        description: this.description
      };

      const headers = {
        Authorization: `Bearer ${token}`
      };

      this.http.post("http://localhost:8080/api/transfers", body, {headers})
        .subscribe({
          next: (res: any) => {
            this.transferResult = res;
            this.transferConfirmed = true;
          },
          error: (err) => {
            console.error(err);
            this.message = "Error realizando la transferencia.";
          }
        });

    } catch (e) {
      console.error(e);
      this.message = "Error obteniendo token.";
    }
  }

  goDashboard() {
    this.router.navigate(['/autenticacion/dashboard']);
  }
}
