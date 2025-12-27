import { Component } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  template: `
    <div class="min-h-screen flex items-center justify-center bg-cyber-black p-4 pattern-grid">
      <div class="glass-panel p-8 rounded-lg w-full max-w-md relative overflow-hidden">
        <!-- Decorative Glow -->
        <div class="absolute top-0 left-0 w-full h-1 bg-cyber-neon shadow-[0_0_10px_#00f3ff]"></div>

        <h2 class="text-3xl font-mono font-bold text-cyber-neon mb-6 text-center glow-text-cyan">
          SYSTEM LOGIN
        </h2>

        <!-- Toggle User/Admin -->
        <div class="flex mb-6 border-b border-gray-700">
          <button (click)="isAdmin = false" 
            class="flex-1 pb-2 text-center font-mono transition-colors duration-300"
            [class.text-cyber-neon]="!isAdmin"
            [class.border-b-2]="!isAdmin"
            [class.border-cyber-neon]="!isAdmin"
            [class.text-gray-500]="isAdmin">
            USER
          </button>
          <button (click)="isAdmin = true" 
            class="flex-1 pb-2 text-center font-mono transition-colors duration-300"
            [class.text-cyber-pink]="isAdmin"
            [class.border-b-2]="isAdmin"
            [class.border-cyber-pink]="isAdmin"
            [class.text-gray-500]="!isAdmin">
            ADMIN
          </button>
        </div>

        <form (ngSubmit)="onLogin()">
          <div class="mb-4">
            <label class="block text-gray-400 font-mono text-sm mb-2">IDENTIFIER</label>
            <input [(ngModel)]="username" name="username" type="text" 
              class="w-full bg-cyber-dark border border-gray-700 rounded p-3 text-white focus:outline-none focus:border-cyber-neon transition-colors font-mono"
              placeholder="Enter username...">
          </div>
          
          <div class="mb-6">
            <label class="block text-gray-400 font-mono text-sm mb-2">KEY_PASSPHRASE</label>
            <input [(ngModel)]="password" name="password" type="password" 
              class="w-full bg-cyber-dark border border-gray-700 rounded p-3 text-white focus:outline-none focus:border-cyber-neon transition-colors font-mono"
              placeholder="Enter password...">
          </div>

          <div *ngIf="errorMessage" class="mb-4 text-red-500 font-mono text-sm text-center">
            [ERROR]: {{ errorMessage }}
          </div>

          <button type="submit" 
            class="w-full bg-cyber-dark text-cyber-neon border border-cyber-neon py-3 rounded font-mono font-bold hover:bg-cyber-neon hover:text-black transition-all duration-300 shadow-[0_0_15px_rgba(0,243,255,0.2)]">
            {{ isAdmin ? 'EXECUTE ADMIN ACCESS' : 'INITIATE SESSION' }}
          </button>
        </form>

        <p class="mt-4 text-center text-gray-600 text-xs font-mono">
          SECURE CONNECTION ESTABLISHED. V.2.0.77
        </p>
      </div>
    </div>
  `,
  styles: []
})
export class LoginComponent {
  username = '';
  password = '';
  isAdmin = false;
  errorMessage = '';

  constructor(private auth: AuthService, private router: Router) { }

  onLogin() {
    this.errorMessage = '';
    this.auth.login(this.username, this.password, this.isAdmin).subscribe({
      next: (res) => {
        if (res.success) {
          this.router.navigate(['/home']);
        }
      },
      error: (err) => {
        this.errorMessage = err.error.message || 'Access Denied';
      }
    });
  }
}
