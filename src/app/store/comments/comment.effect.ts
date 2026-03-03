import { Injectable } from '@angular/core';
import { Store } from '@ngrx/store';
import { Actions, ofType, createEffect } from '@ngrx/effects';
import { updateScore, addComment, addReply } from './comment.action';
import { Comment } from '../../core/models/comment.model';
import { tap, withLatestFrom } from 'rxjs/operators';

interface AppState {
  commentsState: Comment[];
}

@Injectable()
export class CommentsEffects {
  // declare the property but don’t initialise it here
  saveCommentsToLocalStorage$;

  constructor(
    private actions$: Actions,
    private store: Store<AppState>
  ) {
    // now that `actions$` and `store` exist, build the effect
    this.saveCommentsToLocalStorage$ = createEffect(
      () =>
        this.actions$.pipe(
          ofType(updateScore, addComment, addReply),
          withLatestFrom(this.store.select(s => s.commentsState)),
          tap(([action, comments]) => {
            console.log('action', action);
            console.log('comments', comments);
            localStorage.setItem('commentsState', JSON.stringify(comments));
          })
        ),
      { dispatch: false }
    );
  }
}