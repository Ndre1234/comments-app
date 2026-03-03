import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CommentReply } from './comment-reply';

describe('CommentReply', () => {
  let component: CommentReply;
  let fixture: ComponentFixture<CommentReply>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CommentReply]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CommentReply);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
