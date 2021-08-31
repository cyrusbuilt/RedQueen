import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LoginHistoryListComponent } from './login-history-list.component';

describe('LoginHistoryListComponent', () => {
  let component: LoginHistoryListComponent;
  let fixture: ComponentFixture<LoginHistoryListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ LoginHistoryListComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(LoginHistoryListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
