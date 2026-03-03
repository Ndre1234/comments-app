import { Component, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { loadCommentsSuccess } from './store/comments/comment.action';
import { DataService } from './core/services/data.service';

@Component({
  selector: 'app-root',
  standalone: false,
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'comments-app';

  constructor(private store: Store, private dataService: DataService) {}

  ngOnInit() {
    // Try to load state from localStorage first
    const savedComments = JSON.parse(localStorage.getItem('commentsState') || '[]');
    
    if (savedComments.length > 0) {
      // Load from localStorage if available
      this.store.dispatch(loadCommentsSuccess({ comments: savedComments }));
    } else {
      // Otherwise, load from your data service or API
      this.dataService.getComments().subscribe({
        next: data => {
          this.store.dispatch(loadCommentsSuccess({ comments: data.comments }));
        }
      });
    }
  }
}