import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

import { CommentItem, ConfirmDeleteDialogComponent } from './comment-item';

describe('CommentItem', () => {
  let component: CommentItem;
  let fixture: ComponentFixture<CommentItem>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CommentItem],
      providers: [
        { provide: NgbModal, useValue: { open: () => ({ componentInstance: {}, result: Promise.resolve() }) } }
      ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CommentItem);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('onEditClick should enter edit mode and prefill editText', () => {
    // Mock a comment
    component.comment = {
      id: 1,
      content: 'Test comment',
      createdAt: new Date().toISOString(),
      score: 0,
      user: { username: 'testuser', image: { png: '' } },
      replies: []
    };

    component.onEditClick();
    expect(component.isEditing).toBe(true);
    expect(component.editText).toBe('Test comment');
  });

  it('cancelEdit should exit edit mode and clear editText', () => {
    component.isEditing = true;
    component.editText = 'some content';
    component.cancelEdit();
    expect(component.isEditing).toBe(false);
    expect(component.editText).toBe('');
  });

  it('saveEdit should emit editSave event with comment id and content', (done) => {
    component.comment = {
      id: 42,
      content: 'old content',
      createdAt: new Date().toISOString(),
      score: 0,
      user: { username: 'testuser', image: { png: '' } },
      replies: []
    };
    component.editText = ' new content '; // with whitespace to test trim

    component.editSave.subscribe((event) => {
      expect(event.commentId).toBe(42);
      expect(event.content).toBe('new content');
      expect(component.isEditing).toBe(false);
      expect(component.editText).toBe('');
      done();
    });

    component.saveEdit();
  });

  it('onDeleteClick should open modal and emit deleteComment on confirmation', () => {
    component.comment = {
      id: 99,
      content: 'to be deleted',
      createdAt: new Date().toISOString(),
      score: 0,
      user: { username: 'testuser', image: { png: '' } },
      replies: []
    };
    const fakeModalRef: any = {
      componentInstance: {},
      result: Promise.resolve('delete')
    };
    const modalSpy = spyOn((component as any).modal, 'open').and.returnValue(fakeModalRef);
    const deleteSpy = spyOn(component.deleteComment, 'emit');

    component.onDeleteClick();
    expect(modalSpy).toHaveBeenCalledWith(ConfirmDeleteDialogComponent, { centered: true });
    return fakeModalRef.result.then(() => {
      expect(deleteSpy).toHaveBeenCalledWith(99);
    });
  });
});
