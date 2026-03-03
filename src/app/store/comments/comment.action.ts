import { createAction, props } from '@ngrx/store';
import { Comment } from '../../core/models/comment.model';

export const loadCommentsSuccess = createAction(
  '[Comments] Load Comments Success',
  props<{ comments: Comment[] }>()
);

export const loadCommentsFailure = createAction(
  '[Comments] Load Comments Failure',
  props<{ error: string }>()
);

export const updateScore = createAction(
  '[Comments] Update Score',
  props<{ commentId: number; amount: number }>()
);

export const addComment = createAction(
  '[Comments] Add Comment',
  props<{ comment: Comment }>()
);

export const deleteComment = createAction(
  '[Comments] Delete Comment',
  props<{ commentId: number }>()
);

export const addReply = createAction(
  '[Comments] Add Reply',
  props<{ parentCommentId: number; reply: Comment }>()
);

export const updateComment = createAction(
  '[Comments] Update Comment',
  props<{ commentId: number; content: string }>()
);