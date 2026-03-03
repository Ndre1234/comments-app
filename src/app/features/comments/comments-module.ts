import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';

import { CommentListComponent } from './components/comment-list/comment-list';
import { CommentItemComponent, ConfirmDeleteDialogComponent } from './components/comment-item/comment-item';  // <<
import { CommentReplyComponent } from './components/comment-reply/comment-reply'; // <-- ADD HERE



@NgModule({
  declarations: [
    CommentListComponent,
    CommentItemComponent,
    ConfirmDeleteDialogComponent,
    CommentReplyComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    MatFormFieldModule,
    MatInputModule,
    NgbModule
  ],
  exports: [
    CommentListComponent
  ]
})
export class CommentsModule { }
