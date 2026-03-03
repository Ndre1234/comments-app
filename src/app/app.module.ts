import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { StoreModule } from '@ngrx/store';
import { EffectsModule } from '@ngrx/effects';
import { StoreDevtoolsModule } from '@ngrx/store-devtools';
import { AppComponent } from './app.component';
import { commentReducer } from './store/comments/comment.reducer';
import { CommentsEffects } from './store/comments/comment.effect';
import { CommentsModule } from './features/comments/comments-module';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';

@NgModule({
  declarations: [AppComponent],
  imports: [
    BrowserModule,
    MatButtonModule,
    MatInputModule,
    StoreModule.forRoot({ commentsState: commentReducer }),
    EffectsModule.forRoot([CommentsEffects]),
    StoreDevtoolsModule.instrument({ maxAge: 25 }),
    CommentsModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }