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
    const savedComments = JSON.parse(localStorage.getItem('commentsState') || '[]');
    
    if (savedComments.length > 0) {
      this.store.dispatch(loadCommentsSuccess({ comments: savedComments }));
    } else {
      this.dataService.getComments().subscribe({
        next: data => {
          this.store.dispatch(loadCommentsSuccess({ comments: data.comments }));
        }
      });
    }
  }
}