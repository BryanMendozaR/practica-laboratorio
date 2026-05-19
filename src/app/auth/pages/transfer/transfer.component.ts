import {Component} from '@angular/core';
import {Router} from '@angular/router';
import {AuthTokenService} from '../../../services/auth-token.service';
import {TransferService} from '../../../services/transfer.service';

@Component({
  selector: 'app-transfer',
  templateUrl: './transfer.component.html',
  styleUrl: './transfer.component.scss'
})
export class TransferComponent {
  receiverEmail: string = '';
  amount: number = 0;
  description: string = '';
  transferConfirmed: boolean = false;
  message: string = '';
  transferResult: any;

  constructor(
    private transferService: TransferService,
    private authToken: AuthTokenService,
    private router: Router
  ) { }

  async ngOnInit() {
    const pending = localStorage.getItem("pending_transfer");

    if (pending) {
      const data = JSON.parse(pending);
      this.receiverEmail = data.receiverEmail;
      this.amount = data.amount;
      this.description = data.description;
      localStorage.removeItem("pending_transfer");
      await this.executeTransfer();
    }
  }

  async executeTransfer() {
    try {
      this.transferResult = await this.transferService.createTransfer({
        receiverEmail: this.receiverEmail,
        amount: this.amount,
        description: this.description
      });
      this.transferConfirmed = true;
    } catch {
      this.message = "Error al realizar transferencia";
    }
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

    this.authToken.loginWithRedirect({
      audience: 'https://transfer-api',
      scope: 'openid profile email transactions:transfer',
      appState: {target: this.router.url}
    });
  }

  goDashboard() {
    this.router.navigate(['/autenticacion/dashboard']);
  }
}
