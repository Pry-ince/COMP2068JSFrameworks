import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root',
})
export class ProjectService {
  //use dependency injection
  constructor(private http: HttpClient) {}

  //method to get projects in backend
  getProjects() {
    // making get requests to the backend
    return this.http.get(`http://localhost:3000/api/projects`);
  }
}
