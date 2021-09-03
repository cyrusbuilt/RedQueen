import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AccessControlUserEditComponent } from './access-control-user-edit.component';

describe('AccessControlUserEditComponent', () => {
  let component: AccessControlUserEditComponent;
  let fixture: ComponentFixture<AccessControlUserEditComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AccessControlUserEditComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AccessControlUserEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
