import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class EventRequirementService {

  private baseUrl = "http://localhost:9090/api/eventRequirement";

  constructor(private http: HttpClient) {}

  // Get all event requirements
  getAll(){
    return this.http.get(this.baseUrl);
  }

  // Get event requirement by id
  getById(id:number){
    return this.http.get(`${this.baseUrl}/${id}`);
  }

  // Create event requirement
  save(data:any){
    return this.http.post(this.baseUrl,data);
  }

  // Update event requirement
  update(id:number,data:any){
    return this.http.put(`${this.baseUrl}/${id}`,data);
  }

  // Delete event requirement
  delete(id:number){
    return this.http.delete(`${this.baseUrl}/${id}`);
  }

}
