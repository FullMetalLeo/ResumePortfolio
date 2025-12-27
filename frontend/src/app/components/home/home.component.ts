import { Component, OnInit } from '@angular/core';
import { DataService } from '../../services/data.service';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styles: []
})
export class HomeComponent implements OnInit {

  config: any = {};
  comments: any[] = [];
  newComment = '';
  isAdmin = false;

  constructor(
    private dataService: DataService,
    private authService: AuthService,
    private router: Router
  ) { }

  ngOnInit(): void {
    if (!this.authService.isLoggedIn()) {
      this.router.navigate(['/login']);
      return;
    }

    this.isAdmin = this.authService.getRole() === 'admin';

    // Load Portfolio Config
    this.dataService.getConfig().subscribe(data => {
      this.config = data;
    });

    // Load Comments
    this.loadComments();
  }

  loadComments() {
    this.dataService.getComments().subscribe((data: any) => {
      this.comments = data.comments;
    });
  }

  postComment() {
    if (!this.newComment.trim()) return;

    this.dataService.postComment(this.newComment).subscribe(() => {
      this.newComment = '';
      this.loadComments(); // Refresh list
    });
  }

  submitCollab() {
    alert("Collaboration request transmitted to null void (Feature pending backend implementation, check console for data).");
  }

  logout() {
    this.authService.logout();
    this.router.navigate(['/login']);
  }
}
