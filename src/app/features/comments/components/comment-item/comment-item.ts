import { Component, EventEmitter, Input, Output, Inject } from '@angular/core';
import { NgbModal, NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { Comment } from '../../../../core/models/comment.model';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';

// Extend dayjs with the relativeTime plugin
dayjs.extend(relativeTime);

@Component({
  standalone: false,
  selector: 'app-comment-item',
  templateUrl: './comment-item.html',
  styleUrls: ['./comment-item.css']
})
export class CommentItemComponent {

  @Input() comment!: Comment;

  @Output() upvote = new EventEmitter<number>();
  @Output() downvote = new EventEmitter<number>();
  @Output() reply = new EventEmitter<number>();
  @Output() edit = new EventEmitter<number>();
  @Output() deleteComment = new EventEmitter<number>();
  @Output() editSave = new EventEmitter<{ commentId: number; content: string }>();

  // Edit state
  isEditing = false;
  editText = '';

  constructor(private modal: NgbModal) {}

  /**
   * Called when clicking the + button in the score panel
   */
  onUpvote() {
    this.upvote.emit(this.comment.id);
  }

  /**
   * Called when clicking the – button in the score panel
   */
  onDownvote() {
    this.downvote.emit(this.comment.id);
  }

  /**
   * Called when clicking "Reply"
   */
  onReplyClick() {
    this.reply.emit(this.comment.id);
  }

  /**
   * Called when clicking "Edit"
   */
  onEditClick() {
    this.isEditing = true;
    this.editText = this.comment.content;
  }

  /**
   * Called when clicking "Delete" - shows confirmation dialog first
   */
  onDeleteClick() {
    const modalRef = this.modal.open(ConfirmDeleteDialogComponent, { centered: true , size: 'md' });
    
    modalRef.result.then(
      result => {
        if (result === 'delete') {
          this.deleteComment.emit(this.comment.id);
        }
      },
      () => {
        // dismissed
      }
    );
  }

  /**
   * Determine if the current comment belongs to the logged‑in user
   * (optional: only needed if you show Edit/Delete for own posts)
   */
  isCurrentUser(username: string): boolean {
    return this.comment.user.username === this.currentUserUsername;
  }

  /**
   * This assumes you push the current user's username
   * into this component from parent OR store — adjust as needed for your app’s logic.
   */
  @Input() currentUserUsername: string = '';

  /**
   * Get the relative time of when the comment was created
   */
  getRelativeTime(): string {
    return dayjs(this.comment.createdAt).fromNow();
  }

  /**
   * Cancel edit mode
   */
  cancelEdit() {
    this.isEditing = false;
    this.editText = '';
  }

  /**
   * Save edited comment content
   */
  saveEdit() {
    const text = this.editText.trim();
    if (!text) return;
    this.editSave.emit({ commentId: this.comment.id, content: text });
    this.cancelEdit();
  }
}

/**
 * Confirmation dialog for deleting a comment (ng-bootstrap modal)
 */
@Component({
  selector: 'app-confirm-delete-dialog',
  templateUrl: './confirm-delete-dialog.html',
  styleUrls: ['./confirm-delete-dialog.css'],
  standalone: false
})
export class ConfirmDeleteDialogComponent {
  // input property set by caller

  constructor(@Inject(NgbActiveModal) public activeModal: NgbActiveModal) {}

  onCancel() {
    this.activeModal.dismiss('cancel');
  }

  onConfirm() {
    this.activeModal.close('delete');
  }
}