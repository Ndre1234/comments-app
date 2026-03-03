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
  
  // Tracks which comments have a reply form open
  activeReplyParentId: number | null = null;

  constructor(
    private store: Store<{ commentsState: Comment[] }>,
    private dataService: DataService,
    private cdr: ChangeDetectorRef,
  ) {}
  // For the textarea
  newCommentText: string = '';

  // For user avatar image
  currentUserAvatar: string = '';

  ngOnInit() {
    // pipe the raw comments through a sorter so the template always receives
    // first‑level comments ordered by score (highest first) and every set of
    // replies ordered by creation time (oldest first).
    this.comments$ = this.store.select(state => state.commentsState)
      .pipe(
        map(comments => this.prepareCommentsForDisplay(comments))
      );

    // keep the debug subscription for change detection
    this.comments$.subscribe(all => {
      console.log('Current comments state in UI:', all);
      this.cdr.detectChanges(); // Manually trigger change detection
    });

    // 1. hydrate the UI from localStorage if possible
    const savedUser = JSON.parse(localStorage.getItem('currentUser') || 'null');
    if (savedUser) {
      this.currentUserName   = savedUser.username;
      this.currentUserAvatar = savedUser.image.png;
    }

    // 2. then load comments, but only fetch the default user once
    this.dataService.getComments().subscribe({
      next: data => {
        // if we didn’t already have a user, take it from the payload
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

  /**
   * Called when user clicks SEND
   */
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

    // Clear the textarea
    this.newCommentText = '';
  }

  /**
   * Dispatch vote update actions
   */
  upvote(commentId: number) {
    this.store.dispatch(updateScore({ commentId, amount: 1 }));
  }

  downvote(commentId: number) {
    this.store.dispatch(updateScore({ commentId, amount: -1 }));
  }

  /**
   * Toggle reply form for a comment
   */
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

  /**
   * Stub: Delete comment
   * You can expand to show confirmation modal
   */
  onDeleteComment(commentId: number) {
    this.store.dispatch(deleteComment({ commentId }));
  }

  /**
   * Stub: Edit comment
   * You can expand to include an edit input form
   */
  /**
   * Stub: Edit comment
   * (now handled by comment-item component)
   */
  onEditComment(commentId: number, content: string) {
    // component-local editing is now in comment-item
  }

  /**
   * Handle edit save from comment-item component
   */
  onEditSave(event: { commentId: number; content: string }) {
    this.store.dispatch(updateComment({ commentId: event.commentId, content: event.content }));
  }

  cancelEdit() {
    // no longer used
  }

  saveEditedComment() {
    // no longer used
  }

  /**
   * Add a top‑level comment
   * Useful for your “Add a comment…” box
   */
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

  /**
   * Utility used when transforming the comments observable. Returns a deep
   * copy of the original array with top‑level comments sorted by their
   * `score` value and any replies sorted by `createdAt`.
   */
  /**
   * trackBy function so Angular can avoid re-rendering the entire list when
   * only a single comment has changed.
   */
  trackById(index: number, item: Comment) {
    return item.id;
  }

  private prepareCommentsForDisplay(comments: Comment[]): Comment[] {
    // copy to avoid mutating store data
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