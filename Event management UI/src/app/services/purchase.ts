import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class PurchaseService {
  private baseUrl = 'http://localhost:9090/api/purchases';

  constructor(private http: HttpClient) {}

  getAll(): Observable<any[]> {
    return this.http.get<any[]>(this.baseUrl);
  }

  getById(id: number): Observable<any> {
    return this.http.get<any>(`${this.baseUrl}/${id}`);
  }

  getBySupplierId(supplierId: number): Observable<any[]> {
    return this.http.get<any[]>(`${this.baseUrl}/supplier/${supplierId}`);
  }

  save(supplierId: number, data: any): Observable<any> {
    return this.http.post<any>(`${this.baseUrl}/supplier/${supplierId}`, data);
  }

  delete(id: number): Observable<any> {
    return this.http.delete<any>(`${this.baseUrl}/${id}`);
  }
}