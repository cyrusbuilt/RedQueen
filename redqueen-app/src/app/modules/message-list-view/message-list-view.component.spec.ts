import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MessageListViewComponent } from './message-list-view.component';

describe('MessageListViewComponent', () => {
  let component: MessageListViewComponent;
  let fixture: ComponentFixture<MessageListViewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MessageListViewComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MessageListViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
