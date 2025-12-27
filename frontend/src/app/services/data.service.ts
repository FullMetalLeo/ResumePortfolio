import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class DataService {

  private apiUrl = 'http://localhost:3000/api';

  constructor(private http: HttpClient) { }

  // ==========================================
  // Get Portfolio Config
  // ==========================================
  // Reads the JSON file from the assets folder.
  getConfig(): Observable<any> {
    return this.http.get('/assets/portfolio-config.json');
  }

  // ==========================================
  // Get Comments
  // ==========================================
  getComments(): Observable<any> {
    return this.http.get(`${this.apiUrl}/comments`);
  }

  // ==========================================
  // Post Comment
  // ==========================================
  postComment(text: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/comments`, { text });
  }
}
