import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule } from '@angular/forms';

import { CommentReplyComponent } from './comment-reply';

describe('CommentReply', () => {
  let component: CommentReplyComponent;
  let fixture: ComponentFixture<CommentReplyComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CommentReplyComponent, FormsModule]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CommentReplyComponent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
