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

  it('prepareCommentsForDisplay sorts top-level by score and replies by time', () => {
    const mockComments = [
      { id: 1, score: 5, createdAt: '2020-01-01T00:00:00Z', replies: [], content:'', user:{username:'',image:{png:''}} },
      { id: 2, score: 10, createdAt: '2020-01-02T00:00:00Z', replies: [], content:'', user:{username:'',image:{png:''}} }
    ];
    const sorted = component['prepareCommentsForDisplay'](mockComments as any);
    expect(sorted[0].id).toBe(2);

    // nested replies timestamp ordering
    const withReplies = [
      { id:3, score:0, createdAt:'2020-01-01T00:00:00Z', replies:[
          { id:4, score:0, createdAt:'2020-01-03T00:00:00Z', replies:[], content:'', user:{username:'',image:{png:''}} },
          { id:5, score:0, createdAt:'2020-01-02T00:00:00Z', replies:[], content:'', user:{username:'',image:{png:''}} }
        ], content:'', user:{username:'',image:{png:''}} }
    ];
    const sortedReplies = component['prepareCommentsForDisplay'](withReplies as any);
    expect(sortedReplies[0].replies![0].id).toBe(5);
    expect(sortedReplies[0].replies![1].id).toBe(4);
  });
});
