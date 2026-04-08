import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class RequirementService {

  private baseUrl = "http://localhost:9090/api/requirements";

  constructor(private http: HttpClient) {}

  // Get all requirements
  getAll(){
    return this.http.get(this.baseUrl);
  }

  // Get requirement by id
  getById(id:number){
    return this.http.get(`${this.baseUrl}/${id}`);
  }

  // Create requirement
  save(data:any){
    return this.http.post(this.baseUrl,data);
  }

  // Update requirement
  update(id:number,data:any){
    return this.http.put(`${this.baseUrl}/${id}`,data);
  }

  // Delete requirement
  delete(id:number){
    return this.http.delete(`${this.baseUrl}/${id}`);
  }

}
