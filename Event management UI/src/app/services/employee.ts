import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class EmployeeService {

  private baseUrl = "http://localhost:9090/api/employee";

  constructor(private http: HttpClient) {}

  getAll(): Observable<any[]>{
    return this.http.get<any[]>(this.baseUrl);
  }

  getById(id:number): Observable<any>{
    return this.http.get(`${this.baseUrl}/${id}`);
  }

  save(data:any): Observable<any>{
    return this.http.post(this.baseUrl,data);
  }

  update(id:number,data:any): Observable<any>{
    return this.http.put(`${this.baseUrl}/${id}`,data);
  }

  delete(id:number): Observable<any>{
    return this.http.delete(`${this.baseUrl}/${id}`);
  }

}
