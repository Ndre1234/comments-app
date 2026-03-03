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

  onUpvote() {
    this.upvote.emit(this.comment.id);
  }

  onDownvote() {
    this.downvote.emit(this.comment.id);
  }

  onReplyClick() {
    this.reply.emit(this.comment.id);
  }

  onEditClick() {
    this.isEditing = true;
    this.editText = this.comment.content;
  }

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
        console.log('Delete cancelled');
      }
    );
  }

  isCurrentUser(username: string): boolean {
    return this.comment.user.username === this.currentUserUsername;
  }

  @Input() currentUserUsername: string = '';

  getRelativeTime(): string {
    return dayjs(this.comment.createdAt).fromNow();
  }

  cancelEdit() {
    this.isEditing = false;
    this.editText = '';
  }

  saveEdit() {
    const text = this.editText.trim();
    if (!text) return;
    this.editSave.emit({ commentId: this.comment.id, content: text });
    this.cancelEdit();
  }
}




// FOR THE MODALL
@Component({
  selector: 'app-confirm-delete-dialog',
  templateUrl: './confirm-delete-dialog.html',
  styleUrls: ['./confirm-delete-dialog.css'],
  standalone: false
})
export class ConfirmDeleteDialogComponent {

  constructor(@Inject(NgbActiveModal) public activeModal: NgbActiveModal) {}

  onCancel() {
    this.activeModal.dismiss('cancel');
  }

  onConfirm() {
    this.activeModal.close('delete');
  }
}