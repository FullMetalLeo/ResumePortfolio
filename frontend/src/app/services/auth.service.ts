import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap } from 'rxjs'; // 'tap' allows us to perform side effects (like saving token)

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private apiUrl = 'http://localhost:3000/api'; // The backend URL
  private userRole: string | null = null;

  constructor(private http: HttpClient) { }

  // ==========================================
  // Login Method
  // ==========================================
  // Sends username/password to the backend.
  // Returns an Observable that the component can subscribe to.
  login(username: string, password: string, isAdmin: boolean): Observable<any> {
    const endpoint = isAdmin ? '/admin-login' : '/login';

    return this.http.post<any>(`${this.apiUrl}${endpoint}`, { username, password }).pipe(
      tap(response => {
        if (response.success) {
          this.userRole = response.role;
          // In a real app, we would save a JWT token here.
          // For now, we store simple state.
          localStorage.setItem('userRole', response.role);
        }
      })
    );
  }

  // ==========================================
  // Logout Method
  // ==========================================
  logout() {
    this.userRole = null;
    localStorage.removeItem('userRole');
  }

  // ==========================================
  // Check if Logged In
  // ==========================================
  isLoggedIn(): boolean {
    return !!localStorage.getItem('userRole'); // Returns true if role exists
  }

  getRole(): string | null {
    return localStorage.getItem('userRole');
  }
}
