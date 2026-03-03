import { Component, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { Comment } from '../../../../core/models/comment.model';
import { DataService } from '../../../../core/services/data.service';
import { ChangeDetectorRef } from '@angular/core';

import {
  loadCommentsSuccess,
  loadCommentsFailure,
  updateScore,
  addComment,
  deleteComment,
  updateComment
} from '../../../../store/comments/comment.action';

@Component({
  standalone: false,
  selector: 'app-comment-list',
  templateUrl: './comment-list.html',
  styleUrls: ['./comment-list.css']
})
export class CommentListComponent implements OnInit {
  
  comments$!: Observable<Comment[]>;
  currentUserName: string = '';
  
  activeReplyParentId: number | null = null;

  constructor(
    private store: Store<{ commentsState: Comment[] }>,
    private dataService: DataService,
    private cdr: ChangeDetectorRef,
  ) {}
  
  newCommentText: string = ''; // For the textarea
  currentUserAvatar: string = ''; // For user avatar image

  ngOnInit() {
    this.comments$ = this.store.select(state => state.commentsState)
      .pipe(
        map(comments => this.prepareCommentsForDisplay(comments))
      );

    this.comments$.subscribe(all => {
      console.log('Current comments state in UI:', all);
      this.cdr.detectChanges(); 
    });

    const savedUser = JSON.parse(localStorage.getItem('currentUser') || 'null');
    if (savedUser) {
      this.currentUserName   = savedUser.username;
      this.currentUserAvatar = savedUser.image.png;
    }

    this.dataService.getComments().subscribe({
      next: data => {
        if (!savedUser) {
          this.currentUserName   = data.currentUser.username;
          this.currentUserAvatar = data.currentUser.image.png;
          localStorage.setItem('currentUser', JSON.stringify(data.currentUser));
        }

        // load comments exactly as before
        this.store.dispatch(loadCommentsSuccess({ comments: data.comments }));
      },
      error: err => {
        this.store.dispatch(loadCommentsFailure({ error: err.message }));
      }
    });
  }

  submitNewComment() {
    const text = this.newCommentText.trim();
    if (!text) return;

    const newComment: Comment = {
      id: Math.floor(Math.random() * 1000000),
      content: text,
      createdAt: new Date().toISOString(),
      score: 0,
      user: {
        username: this.currentUserName,
        image: { png: this.currentUserAvatar }
      },
      replies: []
    };

    this.store.dispatch(addComment({ comment: newComment }));

    this.newCommentText = '';
  }

  upvote(commentId: number) {
    this.store.dispatch(updateScore({ commentId, amount: 1 }));
  }

  downvote(commentId: number) {
    this.store.dispatch(updateScore({ commentId, amount: -1 }));
  }

  toggleReplyForm(commentId: number) {
    console.log('toggleReplyForm called with:', commentId);
    if (this.activeReplyParentId === commentId) {
      this.activeReplyParentId = null;
    } else {
      this.activeReplyParentId = commentId;
    }
  }

  closeReplyArea() {
    this.activeReplyParentId = null;
  }

  onDeleteComment(commentId: number) {
    this.store.dispatch(deleteComment({ commentId }));
  }

  onEditComment(commentId: number, content: string) {
    // component-local editing is now in comment-item
    console.log('is being handled in comment-item component')
  }

  onEditSave(event: { commentId: number; content: string }) {
    this.store.dispatch(updateComment({ commentId: event.commentId, content: event.content }));
  }

  cancelEdit() {
  }

  saveEditedComment() {
  }

  addNewComment(content: string) {
    const newComment: Comment = {
      id: Math.floor(Math.random() * 1000000),
      content: content,
      createdAt: new Date().toISOString(),
      score: 0,
      replies: [],
      user: { username: this.currentUserName, image: { png: '' } }
    };
    this.store.dispatch(addComment({ comment: newComment }));
  }

  trackById(index: number, item: Comment) {
    return item.id;
  }

  private prepareCommentsForDisplay(comments: Comment[]): Comment[] {
    const clone = (items: Comment[]): Comment[] =>
      items.map(c => ({ ...c, replies: c.replies ? clone(c.replies) : [] }));

    const timed = (items: Comment[]): Comment[] => {
      return clone(items)
        .sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime())
        .map(c => ({ ...c, replies: c.replies ? timed(c.replies) : [] }));
    };

    const scored = clone(comments)
      .sort((a, b) => b.score - a.score) // highest score first
      .map(c => ({
        ...c,
        replies: timed(c.replies || [])
      }));

    return scored;
  }
}