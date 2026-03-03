import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CommentList } from './comment-list';

describe('CommentList', () => {
  let component: CommentList;
  let fixture: ComponentFixture<CommentList>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CommentList]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CommentList);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('onEditSave dispatches updateComment action', () => {
    const spy = spyOn(component['store'], 'dispatch');
    component.onEditSave({ commentId: 42, content: 'updated content' });
    expect(spy).toHaveBeenCalledWith(jasmine.objectContaining({
      commentId: 42,
      content: 'updated content'
    }));
  });
});
