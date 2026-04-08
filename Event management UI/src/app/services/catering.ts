import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class CateringService {

  private baseUrl = "http://localhost:9090/api/catering";

  constructor(private http: HttpClient) {}

  // Get all catering
  getAll(){
    return this.http.get(this.baseUrl);
  }

  // Get catering by id
  getById(id:number){
    return this.http.get(`${this.baseUrl}/${id}`);
  }

  // Create catering
  save(data:any){
    return this.http.post(this.baseUrl,data);
  }

  // Update catering
  update(id:number,data:any){
    return this.http.put(`${this.baseUrl}/${id}`,data);
  }

  // Delete catering
  delete(id:number){
    return this.http.delete(`${this.baseUrl}/${id}`);
  }

}
