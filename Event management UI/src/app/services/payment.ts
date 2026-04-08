import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({ providedIn: 'root' })
export class ClientPaymentService {
  private baseUrl = 'http://localhost:9090/api/payments';

  constructor(private http: HttpClient) {}

  savePayment(bookingId: number, data: any) {
    return this.http.post<any>(`${this.baseUrl}/booking/${bookingId}`, data);
  }

  getAll() {
    return this.http.get<any[]>(this.baseUrl);
  }

  getByBookingId(bookingId: number) {
    return this.http.get<any[]>(`${this.baseUrl}/booking/${bookingId}`);
  }

  getById(id: number) {
    return this.http.get<any>(`${this.baseUrl}/${id}`);
  }

  delete(id: number) {
    return this.http.delete(`${this.baseUrl}/${id}`);
  }
}
