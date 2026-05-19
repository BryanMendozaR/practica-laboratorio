import {HttpClient} from '@angular/common/http';
import {Injectable} from '@angular/core';
import {firstValueFrom} from 'rxjs';
import {environment} from '../../environments/environment';
import {AuthTokenService} from './auth-token.service';

@Injectable({
  providedIn: 'root'
})
export class TransferService {
  private apiUrl = environment.apiBaseUrl;

  constructor(
    private http: HttpClient,
    private authToken: AuthTokenService
  ) { }

  async getHistory(): Promise<any[]> {
    const token = await this.authToken.getToken('https://transfer-api', 'openid profile email transactions:transfer');
    const headers = {Authorization: `Bearer ${token}`};
    return await firstValueFrom(
      this.http.get<any[]>(`${this.apiUrl}api/transfers/history`, {headers})
    );
  }

  async createTransfer(data: {
    receiverEmail: string;
    amount: number;
    description: string;
  }): Promise<any> {
    const token = await this.authToken.getToken('https://transfer-api', 'openid profile email transactions:transfer');
    const headers = {Authorization: `Bearer ${token}`};
    return await firstValueFrom(
      this.http.post(`${this.apiUrl}api/transfers`, data, {headers})
    );
  }
}
