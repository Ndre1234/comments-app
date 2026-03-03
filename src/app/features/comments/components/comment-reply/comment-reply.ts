import { Component, Input, Output, EventEmitter } from '@angular/core';
import { Store } from '@ngrx/store';
import { Comment, CurrentUser } from '../../../../core/models/comment.model';
import { addReply } from '../../../../store/comments/comment.action';
import { DataService } from '../../../../core/services/data.service';

@Component({
  standalone: false,
  selector: 'app-comment-reply',
  templateUrl: './comment-reply.html',
  styleUrls: ['./comment-reply.css']
})
export class CommentReplyComponent {
  @Input() parentId!: number; // Parent comment ID to link reply to
  @Input() parentUsername!: string; // Add the parentUsername input to capture parent username
  @Output() close = new EventEmitter<void>(); // 🔥 notify parent

  replyText: string = '';
  currentUser: CurrentUser | null = null;

  constructor(private store: Store, private dataService: DataService) {
    this.dataService.getComments().subscribe(data => {
      this.currentUser = data.currentUser;
    });
  }

  submitReply() {
    const text = this.replyText.trim();
    console.log('Trying to submit reply:', text, 'parentId:', this.parentId);

    if (!text || !this.currentUser) {
      console.log('No text or no user', this.currentUser);
      return;
    }

    // Create a new reply object
    const newReply: Comment = {
      id: Math.floor(Math.random() * 1000000),
      content: this.replyText,
      createdAt: new Date().toISOString(),
      score: 0,
      user: this.currentUser,
      replies: [], // always ensure it is initialized as an empty array
      replyingTo: this.parentUsername // Set the parent username as replyingTo
    };

    console.log('Dispatching addReply action with reply object:', newReply);

    // Dispatch action to add reply to the parent comment
    this.store.dispatch(
      addReply({ parentCommentId: this.parentId, reply: newReply })
    );

    this.replyText = ''; // Reset the reply input field
    this.close.emit(); // Notify parent component to close the reply form
  }
}