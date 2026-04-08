import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class BookingService {
  private baseUrl = 'http://localhost:9090/api/bookings';

  constructor(private http: HttpClient) {}

  getAll(): Observable<any[]> {
    return this.http.get<any[]>(this.baseUrl);
  }

  getById(id: number): Observable<any> {
    return this.http.get<any>(`${this.baseUrl}/${id}`);
  }

  save(data: any): Observable<any> {
    return this.http.post<any>(this.baseUrl, data);
  }

  update(id: number, data: any): Observable<any> {
    return this.http.put<any>(`${this.baseUrl}/${id}`, data);
  }

  delete(id: number): Observable<any> {
    return this.http.delete<any>(`${this.baseUrl}/${id}`);
  }

  getByClientName(clientName: string): Observable<any[]> {
    return this.http.get<any[]>(`${this.baseUrl}/client/${clientName}`);
  }

  updateStatus(id: number, status: string): Observable<any> {
    return this.http.patch<any>(`${this.baseUrl}/${id}/status`, status);
  }

  getStats(): Observable<any> {
    return this.http.get<any>(`${this.baseUrl}/stats`);
  }

  checkAvailability(venue: string, date: string, startTime: string, endTime: string, excludeId?: number): Observable<any> {
    const venueEnc = encodeURIComponent(venue || '');
    const dateEnc = encodeURIComponent(date || '');
    const startEnc = encodeURIComponent(startTime || '');
    const endEnc = encodeURIComponent(endTime || '');
    let params = `?venue=${venueEnc}&date=${dateEnc}&startTime=${startEnc}&endTime=${endEnc}`;
    if (excludeId) params += `&excludeId=${excludeId}`;
    return this.http.get<any>(`${this.baseUrl}/check-availability${params}`);
  }
}